import {
  AnswerModel,
  QuestionModel,
  QuestionnaireModel,
  MultilingualTextModel,
} from '../../../../common/infrastructure/db/models/QuestionnaireModel';
import Questionnaire from '../../../domain/models/aggregateroots/Questionnaire';
import QuestionnaireName from '../../../domain/models/valueobjects/QuestionnaireName';
import QuestionnaireQuestion from '../../../domain/models/valueobjects/QuestionnaireQuestion';
import { MaxAllowedAnswers, Score, ScoreCap, MultilingualText } from '../../../domain/models/valueobjects/ValueObjects';
import { QuestionAnswerDefinition } from '../../../domain/models/valueobjects/QuestionAnswerDefinition';
import { AnswerId, QuestionId } from '../../../domain/models/valueobjects/IdValueObjects';
import { Service } from 'typedi';
import { QuestionnaireAnswerModel } from '../../../../common/infrastructure/db/models/QuestionnaireAnswerModel';
import QuestionnaireAnswerConverter from './QuestionnaireAnswerConverter';

@Service({ global: true })
export default class QuestionnaireConverter {
  private questionnaireAnswerConverter: QuestionnaireAnswerConverter;

  constructor(questionnaireAnswerConverter: QuestionnaireAnswerConverter) {
    this.questionnaireAnswerConverter = questionnaireAnswerConverter;
  }

  toDomain(questionnaire: QuestionnaireModel, questionnaireAnswer: QuestionnaireAnswerModel | null): Questionnaire {
    return new Questionnaire(
      new QuestionnaireName(questionnaire.name),
      questionnaire.questions.map(question => {
        return this.toQuestionDomain(question);
      }),
      new Score(questionnaire.passingScore),
      questionnaireAnswer ? this.questionnaireAnswerConverter.toDomain(questionnaireAnswer) : undefined,
    );
  }

  toDbEntity(questionnaire: Questionnaire): QuestionnaireModel {
    const dbQuestions: QuestionModel[] = questionnaire.questions.map(question => {
      return {
        id: question.id.val,
        text: this.toTextDbEntity(question.text),
        iconUrl: question.iconUrl,
        maxAllowedAnswers: question.maxAllowedAnswers ? question.maxAllowedAnswers.val : undefined,
        scoreCap: question.scoreCap.val,
        answers: question.answers.map(answer => {
          return this.toAnswerDbEntity(answer);
        }),
      };
    });
    return {
      name: questionnaire.name.val,
      passingScore: questionnaire.passingScore.val,
      questions: dbQuestions,
    };
  }

  private toAnswerDbEntity(answer: QuestionAnswerDefinition): AnswerModel {
    return {
      id: answer.id.val,
      iconUrl: answer.iconUrl,
      text: this.toTextDbEntity(answer.text),
      score: answer.score.val,
    };
  }

  private toQuestionDomain(question: QuestionModel): QuestionnaireQuestion {
    return new QuestionnaireQuestion(
      new QuestionId(question.id),
      this.toTextDomain(question.text),
      new ScoreCap(question.scoreCap),
      question.answers.map(answer => {
        return this.toAnswerDomain(answer);
      }),
      question.iconUrl,
      question.maxAllowedAnswers ? new MaxAllowedAnswers(question.maxAllowedAnswers) : undefined,
    );
  }

  private toAnswerDomain(answer: AnswerModel): QuestionAnswerDefinition {
    return new QuestionAnswerDefinition(
      new AnswerId(answer.id),
      this.toTextDomain(answer.text),
      new Score(answer.score),
      answer.iconUrl,
    );
  }

  private toTextDomain(textModel: MultilingualTextModel): MultilingualText {
    return new MultilingualText(textModel.en, textModel.ar);
  }

  private toTextDbEntity(text: MultilingualText): MultilingualTextModel {
    return { en: text.en, ar: text.ar };
  }
}


