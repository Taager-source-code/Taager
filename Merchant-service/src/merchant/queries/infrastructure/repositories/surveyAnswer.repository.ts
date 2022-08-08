import MongooseService from '../../../../shared-kernel/infrastructure/db/mongoose';
import SurveyAnswerModel from '../../../common/infrastructure/db/schemas/surveyAnswer.model';

class SurveyAnswerRepository {
  mongooseServiceInstance: any;
  constructor() {
    this.mongooseServiceInstance = new MongooseService(SurveyAnswerModel);
  }

  async getSurveyAnswer({ query, limit = 1, sort = { createdAt: -1 }, lean = true }) {
    try {
      const result = await this.mongooseServiceInstance.findWithLimitAndSortedDate(query, limit, sort, lean);
      return result;
    } catch (err) {
      return err;
    }
  }

  async getSurveyAnswerByObjectID(id) {
    try {
      const result = await this.mongooseServiceInstance.findById(id);
      return result;
    } catch (err) {
      return err;
    }
  }

  async updateSurveyAnswerByObjectID(id, document) {
    try {
      const result = await this.mongooseServiceInstance.update(id, document);
      return result;
    } catch (err) {
      return err;
    }
  }
}

export = SurveyAnswerRepository;


