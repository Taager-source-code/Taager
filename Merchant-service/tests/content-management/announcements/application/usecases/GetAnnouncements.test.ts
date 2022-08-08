import { instance, mock, when } from 'ts-mockito';
import { Announcement } from '../../../../../src/content-management/common/infrastructure/db/models/Announcement';
import AnnouncementRepo from '../../../../../src/content-management/queries/infrastructure/repositories/AnnouncementRepo';
import GetAnnouncements from '../../../../../src/content-management/queries/application/usecases/GetAnnouncements';

const announcements: Announcement[] = [
  {
    img: 'testImage1',
    isMobile: false,
    link: 'testLink1',
    country: 'EGY',
  },
  {
    img: 'testImage2',
    isMobile: false,
    link: 'testLink2',
    country: 'EGY',
  },
];

describe('GetAnnouncements', () => {
  test('return list of announcements', async () => {
    // Arrange
    const mockedRepo = mock(AnnouncementRepo);
    const getAnnouncements = new GetAnnouncements(instance(mockedRepo));
    when(mockedRepo.getAnnouncements('EGY')).thenReturn(Promise.resolve(announcements));

    // Act
    const expectedAnnouncements = await getAnnouncements.execute('EGY');
    expect(expectedAnnouncements).toEqual(announcements);
  });
});


