export class QuestionnaireNotFoundError extends Error {
  name: string;
  constructor(name: string) {
    super(`No questionnaire matching the name=${name} was found`);
    this.name = name;
  }
}


