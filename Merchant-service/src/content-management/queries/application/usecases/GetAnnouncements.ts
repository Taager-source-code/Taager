import { Service } from 'typedi';
import AnnouncementRepo from '../../infrastructure/repositories/AnnouncementRepo';
import { Announcement } from '../../../common/infrastructure/db/models/Announcement';

@Service({ global: true })
export default class GetAnnouncements {
  private AnnouncementRepo: AnnouncementRepo;
  constructor(AnnouncementRepo: AnnouncementRepo) {
    this.AnnouncementRepo = AnnouncementRepo;
  }
  execute(country: string): Promise<Announcement[]> {
    return this.AnnouncementRepo.getAnnouncements(country);
  }
}


