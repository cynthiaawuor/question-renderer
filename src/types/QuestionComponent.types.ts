export type Question = {
  id: string;
  label: string;
  type: "text" | "textarea" | "checkbox" | "select" | "radio";
  placeholder?: string;

  required?: boolean;

  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;

  options?: QuestionOption[];

  errorMessages?: {
    required?: string;
    minLength?: string;
    maxLength?: string;
    pattern?: string;
  };
};

export type QuestionOption = {
  label: string;
  value: string;
};

export type AnswerValue = string | string[];

export type Answers = Record<string, AnswerValue>;
