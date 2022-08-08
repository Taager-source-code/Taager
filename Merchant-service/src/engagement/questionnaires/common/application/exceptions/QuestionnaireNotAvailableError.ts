export class QuestionnaireNotAvailableError extends Error {
  name: string;
  constructor(name: string, taagerId: string) {
    super(`Questionnaire with name=${name} is not accessible to taagerId=${taagerId}`);
    this.name = name;
  }
}


