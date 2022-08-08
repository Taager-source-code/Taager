import { Service } from 'typedi';
import AnnouncementDao from '../../../common/infrastructure/db/access/AnnouncementDao';
import Logger from '../../../../shared-kernel/infrastructure/logging/general.log';
import { Announcement } from '../../../common/infrastructure/db/models/Announcement';

@Service({ global: true })
export default class AnnouncementRepo {
  private announcementDao: AnnouncementDao;
  constructor(announcementDao: AnnouncementDao) {
    this.announcementDao = announcementDao;
  }

  getAnnouncements(country: string): Promise<Announcement[]> {
    Logger.info('Retrieving Announcements from the DB');
    return this.announcementDao.getAnnouncements(country);
  }
}


