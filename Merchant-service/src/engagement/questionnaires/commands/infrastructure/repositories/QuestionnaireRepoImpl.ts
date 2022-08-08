import { Service } from 'typedi';
import QuestionnaireRepo from '../../domain/contracts/QuestionnaireRepo';
import Questionnaire from '../../domain/models/aggregateroots/Questionnaire';
import QuestionnaireDao from '../db/access/QuestionnaireDao';
import QuestionnaireConverter from '../db/converters/QuestionnaireConverter';
import QuestionnaireName from '../../domain/models/valueobjects/QuestionnaireName';
import TaagerId from '../../domain/models/valueobjects/TaagerId';
import QuestionnaireAnswerDao from '../db/access/QuestionnaireAnswerDao';
import QuestionnaireAnswerConverter from '../db/converters/QuestionnaireAnswerConverter';

@Service({ global: true })
export default class QuestionnaireRepoImpl implements QuestionnaireRepo {
  private questionnaireDao: QuestionnaireDao;
  private questionnaireAnswerDao: QuestionnaireAnswerDao;
  private questionnaireConverter: QuestionnaireConverter;
  private questionnaireAnswerConverter: QuestionnaireAnswerConverter;

  constructor(
    questionnaireDao: QuestionnaireDao,
    questionnaireConverter: QuestionnaireConverter,
    questionnaireAnswerConverter: QuestionnaireAnswerConverter,
    questionnaireAnswerDao: QuestionnaireAnswerDao,
  ) {
    this.questionnaireDao = questionnaireDao;
    this.questionnaireAnswerDao = questionnaireAnswerDao;
    this.questionnaireConverter = questionnaireConverter;
    this.questionnaireAnswerConverter = questionnaireAnswerConverter;
  }

  async findByName(questionnaireName: QuestionnaireName, taagerId: TaagerId): Promise<Questionnaire | null> {
    const questionnaire = await this.questionnaireDao.findByName(questionnaireName.val);
    const questionnaireAnswer = await this.questionnaireAnswerDao.findByQuestionnaireNameAndTaagerId(
      questionnaireName.val,
      taagerId.val,
    );
    return questionnaire ? this.questionnaireConverter.toDomain(questionnaire, questionnaireAnswer) : null;
  }

  async save(questionnaire: Questionnaire): Promise<void> {
    if (questionnaire.isAnswered && questionnaire.answer) {
      const questionnaireAnswerModel = this.questionnaireAnswerConverter.toDbEntity(
        questionnaire.answer,
        questionnaire.name.val,
      );
      return this.questionnaireAnswerDao.save(questionnaireAnswerModel);
    }
  }
}


