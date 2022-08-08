import { Questionnaire } from '../models/Questionnaire';

export default interface QuestionnaireRepo {
  findByName(name: string): Promise<Questionnaire | null>;
}


