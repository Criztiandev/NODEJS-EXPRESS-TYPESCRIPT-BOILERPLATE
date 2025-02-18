import { ObjectId } from "mongoose";
import { BaseService } from "../../../core/base/service/base.service";
import { BadRequestError } from "../../../utils/error.utils";
import notificationService from "../../notification/service/notification.service";
import { CaseDocument } from "../interface/case.interface";
import CaseRepository from "../repository/case.repository";
import auditService from "../../audit/service/audit.service";
import accountService from "../../account/service/account.service";

class CaseService extends BaseService<CaseDocument> {
  protected readonly repository: typeof CaseRepository;
  constructor(repository: typeof CaseRepository) {
    super(repository);
    this.repository = repository;
  }

  /**
   * Create a new case
   * @param userId - The user ID of the creator
   * @param payload - The case data to create
   * @returns The created case document
   */
  async createCase(
    userId: ObjectId,
    payload: Partial<CaseDocument>
  ): Promise<CaseDocument> {
    const caseNumber = await this.generateCaseNumber();

    const account = await accountService.validateExists(userId, {
      select: "_id",
    });

    if (!account) {
      throw new BadRequestError("User not found");
    }

    const newCase = await this.repository.create({
      ...payload,
      caseNumber,
    });

    if (!newCase) {
      throw new BadRequestError("Failed to create case");
    }

    // Generate initial document (KP FORM 7)

    // Send Notification to the involved parties
    const compliant = Array.isArray(payload.complainants)
      ? payload.complainants[0]
      : payload.complainants;

    const notification = await notificationService.createService({
      title: `Case ${newCase.caseNumber} has been created`,
      message: `Case ${newCase.caseNumber} has been created, please wait for the next step`,
      type: "case_filing",
      recipient: compliant,
      relatedCase: newCase._id as ObjectId,
      deliveryMethod: "inApp",
      deliveryStatus: "sent",
    });

    if (!notification) {
      throw new BadRequestError("Failed to create notification");
    }

    await auditService.createService({
      action: "create",
      entityType: "Case",
      entityId: newCase?._id as ObjectId,
      actionMessage: `Case ${newCase.caseNumber} has been created`,
      createdBy: account._id as ObjectId,
    });

    return newCase;
  }

  /**
   * Update a case
   * @param userId - The user ID of the updater
   * @param caseId - The ID of the case to update
   * @param payload - The case data to update
   * @returns The updated case document
   */
  async updateCase(
    userId: ObjectId,
    caseId: string,
    payload: Partial<CaseDocument>
  ): Promise<CaseDocument> {
    const _case = await this.validateExists(caseId);
    if (!_case) {
      throw new BadRequestError("Case not found");
    }

    const account = await accountService.validateExists(userId, {
      select: "_id",
    });

    if (!account) {
      throw new BadRequestError("User not found");
    }

    const updatedCase = await this.updateService(caseId, payload, {
      select: "_id",
    });

    if (!updatedCase) {
      throw new BadRequestError("Failed to update case");
    }

    // Notification that the case is updated
    await auditService.createService({
      action: "update",
      entityType: "Case",
      entityId: _case._id as ObjectId,
      actionMessage: `Case ${_case.caseNumber} has been updated`,
      createdBy: account._id as ObjectId,
    });

    return updatedCase;
  }

  /**
   * Escalate a case, this will move the case to the next step
   * @param userId - The user ID of the escalator
   * @param caseId - The ID of the case to escalate
   * @param payload - The case data to escalate
   */
  async escalateCase(
    userId: ObjectId,
    caseId: string,
    payload: Partial<CaseDocument>
  ) {
    const existingCase = await this.validateExists(caseId);

    if (!existingCase) {
      throw new BadRequestError("Case not found");
    }

    const account = await accountService.validateExists(userId, {
      select: "_id",
    });

    if (!account) {
      throw new BadRequestError("User not found");
    }

    const updatedCase = await this.updateService(caseId, payload, {
      select: "_id",
    });

    if (!updatedCase) {
      throw new BadRequestError("Failed to escalate case");
    }

    // Generate Escalation Document (KP FORM 10)

    // Send Notification to the involved parties

    // Create Audit
    await auditService.createService({
      action: "escalate",
      entityType: "Case",
      entityId: existingCase._id as ObjectId,
      actionMessage: `Case ${existingCase.caseNumber} has been escalated`,
      createdBy: account._id as ObjectId,
    });

    return updatedCase;
  }

  async resolveCaseWithSettlement(
    userId: ObjectId,
    caseId: string,
    payload: Partial<CaseDocument>
  ) {
    const existingCase = await this.validateExists(caseId);

    if (existingCase.isDeleted) {
      throw new BadRequestError("Case not found");
    }

    if (existingCase.isResolved) {
      throw new BadRequestError("Case already resolved");
    }

    const account = await accountService.validateExists(userId, {
      select: "_id",
    });

    if (!account) {
      throw new BadRequestError("User not found");
    }

    // Update the case with settlement details
    const updatedCase = await this.updateService(
      caseId,
      {
        ...payload,
        status: "settled",
        isResolved: true,
        resolutionDate: new Date(),
      },
      {
        select: "_id",
        errorMessage: "Failed to resolve case with settlement",
      }
    );

    // Generate Settlement Document (KP FORM 11)

    // Send Notification to the involved parties

    // Create Audit
    await auditService.createService({
      action: "resolve",
      entityType: "Case",
      entityId: existingCase._id as ObjectId,
      actionMessage: `Case ${existingCase.caseNumber} has been resolved with settlement`,
      createdBy: account._id as ObjectId,
    });

    return updatedCase;
  }

  /**
   * Check and Escalate Case, this will check if the case is pending for 15 days and escalate it
   * @param userId - The user ID of the checker
   * @returns The updated case document
   */
  async checkAndEscalateCase(userId: ObjectId) {
    const pendingCases = await this.repository.findPaginated(
      { status: "pending" },
      undefined,
      { sort: { createdAt: -1 }, limit: 10 }
    );

    if (pendingCases.data.length === 0) {
      return [];
    }

    const overDueCases = pendingCases.data.filter((_case) => {
      const escalationDate = new Date(_case.createdAt);
      const currentDate = new Date();
      const timeDiffInHours =
        (currentDate.getTime() - escalationDate.getTime()) / (1000 * 60 * 60);
      return timeDiffInHours >= 15;
    });

    if (overDueCases.length === 0) {
      return [];
    }

    const bulkEscalatedCase = await this.repository.batchUpdateByIds(
      overDueCases.map((_case) => _case._id as ObjectId),
      { status: "escalated" }
    );

    if (!bulkEscalatedCase) {
      throw new BadRequestError("Failed to escalate cases");
    }

    await auditService.createService({
      action: "escalate",
      entityType: "Case",
      entityId: overDueCases[0]._id as ObjectId,
      actionMessage: `Cases ${overDueCases[0].caseNumber} has been escalated`,
      createdBy: userId,
    });

    return bulkEscalatedCase;
  }

  private async generateCaseNumber(): Promise<string> {
    const totalCases = await this.repository.getTotalCasesCount();

    const caseNumber = `CASE-${totalCases + 1}`;
    const caseNumberWithLetter = `CASE-${totalCases + 1}${String.fromCharCode(
      65 + totalCases
    )}`;

    if (totalCases > 9999) {
      return caseNumberWithLetter;
    }

    return caseNumber;
  }
}

export default new CaseService(CaseRepository);
