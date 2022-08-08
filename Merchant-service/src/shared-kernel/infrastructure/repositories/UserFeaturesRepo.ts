import { Service } from 'typedi';
import UserFeaturesDao from '../db/access/UserFeaturesDao';

@Service({ global: true })
export default class UserFeaturesRepo {
  private userFeaturesDao: UserFeaturesDao;

  constructor(userFeaturesDao: UserFeaturesDao) {
    this.userFeaturesDao = userFeaturesDao;
  }

  async isFeatureEnabled(featureName: string, taagerId: string): Promise<boolean> {
    return this.userFeaturesDao.isFeatureEnabled(featureName, taagerId);
  }

  async enableFeature(featureName: string, taagerId: string): Promise<void> {
    return this.userFeaturesDao.enableFeature(featureName, taagerId);
  }
}


