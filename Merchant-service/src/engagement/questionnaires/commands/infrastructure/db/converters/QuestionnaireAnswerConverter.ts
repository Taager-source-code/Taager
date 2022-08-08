import {
  GivenAnswerModel,
  QuestionnaireAnswerModel,
} from '../../../../common/infrastructure/db/models/QuestionnaireAnswerModel';
import TaagerId from '../../../domain/models/valueobjects/TaagerId';
import { Score, ScoreCap } from '../../../domain/models/valueobjects/ValueObjects';
import { QuestionGivenAnswerCalculation } from '../../../domain/models/valueobjects/QuestionGivenAnswerCalculation';
import { AnswerId, QuestionId } from '../../../domain/models/valueobjects/IdValueObjects';
import { Service } from 'typedi';
import QuestionnaireAnswer, { AnswerStatus } from '../../../domain/models/entities/QuestionnaireAnswer';

@Service({ global: true })
export default class QuestionnaireAnswerConverter {
  toDomain(questionnaireAnswerEntity: QuestionnaireAnswerModel): QuestionnaireAnswer {
    return new QuestionnaireAnswer(
      new TaagerId(questionnaireAnswerEntity.taagerId),
      AnswerStatus[questionnaireAnswerEntity.status.toUpperCase()],
      questionnaireAnswerEntity.totalScore ? new Score(questionnaireAnswerEntity.totalScore) : undefined,
      questionnaireAnswerEntity.answers ? this.extractDomainAnswers(questionnaireAnswerEntity.answers) : undefined,
    );
  }

  toDbEntity(questionnaireAnswer: QuestionnaireAnswer, questionnaireName: string): QuestionnaireAnswerModel {
    return {
      taagerId: questionnaireAnswer.taagerId.val,
      questionnaireName: questionnaireName,
      status: questionnaireAnswer.status.toLowerCase(),
      totalScore: questionnaireAnswer.totalScore ? questionnaireAnswer.totalScore.val : undefined,
      answers: questionnaireAnswer.answers ? this.extractDbAnswers(questionnaireAnswer.answers) : undefined,
    };
  }

  private extractDomainAnswers(givenAnswers: GivenAnswerModel[]): QuestionGivenAnswerCalculation[] {
    return givenAnswers.map(answer => {
      return new QuestionGivenAnswerCalculation(
        new QuestionId(answer.questionId),
        answer.answerIds.map(answerId => {
          return new AnswerId(answerId);
        }),
        new Score(answer.score),
        new ScoreCap(answer.scoreCap),
      );
    });
  }

  private extractDbAnswers(givenAnswers: QuestionGivenAnswerCalculation[]): GivenAnswerModel[] {
    return givenAnswers.map(answer => {
      return {
        questionId: answer.questionId.val,
        answerIds: answer.answerIds.map(answerId => answerId.val),
        score: answer.score.val,
        scoreCap: answer.scoreCap.val,
      };
    });
  }
}


