
import { BaseController } from "../../../core/base/controller/base.controller";
import { NotificationDocument } from "../interface/notification.interface";
import NotificationService from "../service/notification.service";

class NotificationController extends BaseController<NotificationDocument> {
  protected service: typeof NotificationService;

  constructor() {
    super(NotificationService);
    this.service = NotificationService;
  }
}

export default new NotificationController();
