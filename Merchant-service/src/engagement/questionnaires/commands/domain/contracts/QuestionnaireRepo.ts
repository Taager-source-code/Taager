import Questionnaire from '../models/aggregateroots/Questionnaire';
import QuestionnaireName from '../models/valueobjects/QuestionnaireName';
import TaagerId from '../models/valueobjects/TaagerId';

export default interface QuestionnaireRepo {
  findByName(questionnaireName: QuestionnaireName, taagerId: TaagerId): Promise<Questionnaire | null>;

  save(questionnaire: Questionnaire): Promise<void>;
}


