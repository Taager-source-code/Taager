import MongooseService from '../../../../shared-kernel/infrastructure/db/mongoose';
import SurveyModel from '../../../common/infrastructure/db/schemas/survey.model';

class SurveyRepository {
  mongooseServiceInstance: any;
  constructor() {
    this.mongooseServiceInstance = new MongooseService(SurveyModel);
  }

  async getSurvey({ query, limit = 1, sort = { createdAt: -1 }, lean = true }) {
    try {
      const result = await this.mongooseServiceInstance.findWithLimitAndSortedDate(query, limit, sort, lean);
      return result;
    } catch (err) {
      return err;
    }
  }
}

export = SurveyRepository;


