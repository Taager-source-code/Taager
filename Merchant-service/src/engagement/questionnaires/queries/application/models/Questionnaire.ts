export type Questionnaire = {
  id: string;
  name: string;
  questions: Question[];
};

export type Question = {
  id: string;
  text: MultilingualText;
  iconUrl?: string;
  maxAllowedAnswers?: number;
  answers: Answer[];
};

export type Answer = {
  id: string;
  text: MultilingualText;
  iconUrl?: string;
};

export type MultilingualText = {
  en: string;
  ar: string;
};


