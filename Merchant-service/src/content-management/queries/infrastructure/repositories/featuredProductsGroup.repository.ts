import MongooseService from '../../../../shared-kernel/infrastructure/db/mongoose';
import FeaturedProductsGroupModel from '../../../common/infrastructure/db/schemas/featuredProductsGroup.model';

class FeaturedProductsGroupRepository {
  mongooseServiceInstance: any;
  constructor() {
    this.mongooseServiceInstance = new MongooseService(FeaturedProductsGroupModel);
  }

  async getOneFeaturedProductsGroup(query) {
    try {
      return await this.mongooseServiceInstance.findOne(query);
    } catch (err) {
      return err;
    }
  }
}

export = FeaturedProductsGroupRepository;


