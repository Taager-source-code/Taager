import { OK } from 'http-status';
import { Container } from 'typedi';
import GetAnnouncements from '../../application/usecases/GetAnnouncements';
import { Announcement } from '../../../common/infrastructure/db/models/Announcement';

const container = Container.of();

function handleSuccess(res, getAnnouncementsResponse: Announcement[]) {
  res.status(OK).json({
    msg: 'Announcements list found!',
    data: getAnnouncementsResponse,
  });
}

export const execute = async (req, res) => {
  const getAnnouncements = container.get(GetAnnouncements);
  const getAnnouncementsResponse = await getAnnouncements.execute(req.country.countryIsoCode3);

  return handleSuccess(res, getAnnouncementsResponse);
};


