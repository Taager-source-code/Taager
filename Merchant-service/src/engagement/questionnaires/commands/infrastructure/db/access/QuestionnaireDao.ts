import { Service } from 'typedi';
import { QuestionnaireModel } from '../../../../common/infrastructure/db/models/QuestionnaireModel';
import QuestionnaireSchema from '../../../../common/infrastructure/db/schemas/QuestionnaireSchema';

@Service({ global: true })
export default class QuestionnaireDao {
  findByName(name: string): Promise<QuestionnaireModel | null> {
    return QuestionnaireSchema.findOne({ name }).exec();
  }
}

