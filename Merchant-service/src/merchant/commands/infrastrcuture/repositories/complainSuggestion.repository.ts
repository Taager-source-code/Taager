import MongooseService from '../../../../shared-kernel/infrastructure/db/mongoose';
import ComplainModel from '../../../common/infrastructure/db/schemas/complainSuggestion.model';

class ComplainsRepository {
  mongooseServiceInstance: any;
  constructor() {
    this.mongooseServiceInstance = new MongooseService(ComplainModel);
  }

  async create(complainToCreate) {
    try {
      return await this.mongooseServiceInstance.create(complainToCreate);
    } catch (err) {
      return err;
    }
  }
}

export = ComplainsRepository;


