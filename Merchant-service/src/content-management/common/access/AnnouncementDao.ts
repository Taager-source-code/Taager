import { Service } from 'typedi';
import { Announcement } from '../models/Announcement';
import AnnouncementModel from '../schemas/AnnouncementSchema';

@Service({ global: true })
export default class AnnouncementDao {
  getAnnouncements(country: string): Promise<Announcement[]> {
    return AnnouncementModel.find({ country: country }).exec();
  }
}


