import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import CaseService from "../../case/service/case.service";
import { DocumentsDocument } from "../interface/documents.interface";
import documentsRepository from "../repository/documents.repository";
import KpformService from "./kpform.service";

class DocumentsService extends BaseService<DocumentsDocument> {
  private readonly caseService: typeof CaseService;
  private readonly kpformService: typeof KpformService;

  constructor(documentsRepository: BaseRepository<DocumentsDocument>) {
    super(documentsRepository);
    this.caseService = CaseService;
    this.kpformService = KpformService;
  }

  /**
   * Creates a case document based on the specified type
   * @param caseId The ID of the case
   * @param type The document type to generate
   * @param fileName The name to save the file as
   * @param fileUrl The URL where the file will be accessible
   * @param additionalData Optional additional data to populate the document
   */
  async createCaseDocument(
    caseId: string,
    type: string,
    fileName: string,
    fileUrl: string,
    additionalData?: Record<string, any>
  ) {
    // Validate that the case exists
    const caseQuery = {
      _id: caseId,
      isDeleted: false,
    };

    await this.caseService.validateItemExists(caseQuery, {
      errorMessage: "Case not found or has been deleted",
    });

    // Get case details if needed for document generation
    // const caseDetails = await this.caseService.findById(caseId);

    // Create document timestamp
    const generatedAt = new Date();

    // Process document based on type
    let documentResult = null;
    let documentId;
    let formData;

    switch (type) {
      case "KPFORM-1":
        documentId =
          process.env.KPFORM_1_TEMPLATE_ID ??
          "1XBnEPGmiyCqZE8mgaUZTH7ixeyc3Lzm17Phz5jnOn-E";

        formData = {
          // Use case data first
          municipality: "Albay",
          barangay: "Barangay Name",
          barangayHead: "PUNONG BARANGAY", // Make sure this name matches exactly

          // Ensure full Lupon Member names are used
          luponMembers: [
            "Lupon Member 1",
            "Lupon Member 2",
            "Lupon Member 3",
            "Lupon Member 4",
            "Lupon Member 5",
            "Lupon Member 6",
            "Lupon Member 7",
            "Lupon Member 8",
            "Lupon Member 9",
            "Lupon Member 10",
            "Lupon Member 11",
            "Lupon Member 12",
            "Lupon Member 13",
            "Lupon Member 14",
            "Lupon Member 15",
            "Lupon Member 16",
            "Lupon Member 17",
            "Lupon Member 18",
            "Lupon Member 19",
            "Lupon Member 20",
            "Lupon Member 21",
            "Lupon Member 22",
            "Lupon Member 23",
            "Lupon Member 24",
            "Lupon Member 25",
          ],

          date: generatedAt,
          currentDate: generatedAt,
        };

        documentResult = await this.kpformService.buildKpform1(
          documentId,
          formData
        );
        break;

      case "KPFORM-2":
        documentId =
          process.env.KPFORM_2_TEMPLATE_ID ??
          "1fDKtbYGV9xarkfMlqM0EePMKsvzBm2L1OPdB1krKmQ0";

        formData = {
          // Use case data first
          municipality: "Albay",
          barangay: "Barangay Name",
          barangayHead: "PUNONG BARANGAY",
          barangaySecretary: "BARANGAY SECRETARY",
          appointmentTo: "APPOINTEE NAME", // The person being appointed

          date: generatedAt,
          currentDate: generatedAt,
        };

        documentResult = await this.kpformService.buildKpform2(
          documentId,
          formData
        );
        break;

      // Add cases for other document types
      // case "KPFORM-3":
      //   ...

      default:
        throw new Error(`Unsupported document type: ${type}`);
    }

    // Save the document reference to the database
    // const savedDocument = await this.create({
    //   caseId,
    //   type,
    //   fileName,
    //   fileUrl,
    //   generatedAt,
    //   documentId,
    //   generatedBy: additionalData?.userId || "system",
    // });

    // Return both the API result and the saved document reference
    return {
      apiResult: documentResult,
      // document: savedDocument,
    };
  }

  /**
   * Extracts relevant data from case details for KP Form 1
   */
  private extractKpform1Data(caseDetails: any) {
    // Extract data from case details that's relevant for KP Form 1
    const luponMembers =
      caseDetails.luponMembers ||
      // make it 25 members
      Array.from({ length: 25 }, (_, index) => `Lupon Member ${index + 1}`);
    const punongBarangay = "Crisanto P. Alcala";

    return {
      luponMembers: luponMembers.map((member: any) => member.name || member),
      punongBarangay,
      barangay: caseDetails.barangay || "Barangay Name",
      municipality: caseDetails.municipality || "Municipality of Albay",
    };
  }

  /**
   * Extracts relevant data from case details for KP Form 2
   */
  private extractKpform2Data(caseDetails: any, appointeeName: string) {
    // Extract data from case details that's relevant for KP Form 2
    const punongBarangay = "Crisanto P. Alcala";
    const barangaySecretary = "Juan Dela Cruz";

    return {
      appointmentTo: appointeeName,
      barangayHead: punongBarangay,
      barangaySecretary: barangaySecretary,
      barangay: caseDetails.barangay || "Barangay Name",
      municipality: caseDetails.municipality || "Municipality of Albay",
    };
  }

  /**
   * Retrieves all documents associated with a case
   */
  async getCaseDocuments(caseId: string) {
    // return this.find({
    //   caseId,
    //   isDeleted: false,
    // });
  }

  /**
   * Deletes a document (soft delete)
   */
  async deleteDocument(documentId: string, userId: string) {
    // return this.updateById(documentId, {
    //   isDeleted: true,
    //   deletedAt: new Date(),
    //   deletedBy: userId,
    // });
  }
}

export default new DocumentsService(documentsRepository);
