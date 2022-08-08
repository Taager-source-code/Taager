import { Answer, Question, Questionnaire } from '../../../application/models/Questionnaire';

export default class QuestionnaireDtoConverter {
  public static toQuestionnaireDto(questionnaire: Questionnaire): any {
    return {
      name: questionnaire.name,
      questions: questionnaire.questions.map(q => this.toQuestionDto(q)),
    };
  }

  private static toQuestionDto(question: Question): any {
    return {
      id: question.id,
      textAr: question.text.ar,
      textEn: question.text.en,
      iconUrl: question.iconUrl,
      maxAllowedAnswers: question.maxAllowedAnswers,
      answers: question.answers.map(a => this.toAnswerDto(a)),
    };
  }

  private static toAnswerDto(answer: Answer): any {
    return {
      id: answer.id,
      textAr: answer.text.ar,
      textEn: answer.text.en,
      iconUrl: answer.iconUrl,
    };
  }
}


