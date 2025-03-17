
import { NotificationDocument } from "../interface/notification.interface";
import notificationModel from "../../../model/notification.model";
import { BaseRepository } from "../../../core/base/repository/base.repository";

class NotificationRepository extends BaseRepository<NotificationDocument> {
  constructor() {
    super(notificationModel);
  }
}

export default new NotificationRepository();
