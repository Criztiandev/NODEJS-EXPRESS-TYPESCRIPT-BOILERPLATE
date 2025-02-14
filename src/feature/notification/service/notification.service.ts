
import { BaseRepository } from "../../../core/base/repository/base.repository";
import { BaseService } from "../../../core/base/service/base.service";
import { NotificationDocument } from "../interface/notification.interface";
import notificationRepository from "../repository/notification.repository";

class NotificationService extends BaseService<NotificationDocument> {
  constructor(notificationRepository: BaseRepository<NotificationDocument>) {
    super(notificationRepository);
  }
}

export default new NotificationService(notificationRepository);
