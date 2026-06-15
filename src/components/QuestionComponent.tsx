import { useState } from "react";
import questionsArray from "../data/questions.json";
import type {
  Answers,
  AnswerValue,
  Question,
} from "../types/QuestionComponent.types";

const questions = questionsArray;

function validate(question: Question, answer: AnswerValue) {
  if (question.required && answer.length === 0) {
    return question.errorMessages?.required;
  }
  if (
    question.maxLength !== undefined &&
    typeof answer === "string" &&
    answer.length > question.maxLength
  ) {
    return question.errorMessages?.maxLength;
  }
  if (
    question.minLength !== undefined &&
    typeof answer === "string" &&
    answer.length < question.minLength
  ) {
    return question.errorMessages?.minLength;
  }
  if (question.pattern !== undefined && typeof answer === "string") {
    if (!question.pattern.test(answer)) {
      return question.errorMessages?.pattern;
    }
  }
}

function preventPasting(
  e: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>,
) {
  e.preventDefault();
}
function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
  e.preventDefault();
  questions.forEach((question) => {});
  console.log("SUCCESS");
}

export default function QuestionsRender() {
  const [answers, setAnswers] = useState<Answers>({});

  return (
    <div>
      <form action="" onSubmit={onSubmit}>
        {questions.map((question) => (
          <div key={question.id}>
            {question.type === "text" ? (
              <div>
                <label htmlFor={question.id}>{question.label}</label>
                <input
                  onPaste={preventPasting}
                  type="text"
                  id={question.id}
                  placeholder={question.placeholder}
                  required={question.required}
                  value={answers[question.id]}
                  onChange={(e) => {
                    setAnswers((prev) => {
                      return {
                        ...prev,
                        [question.id]: e.target.value,
                      };
                    });
                  }}
                />
              </div>
            ) : question.type === "textarea" ? (
              <div>
                <label htmlFor={question.id}>{question.label}</label>
                <textarea
                  name={question.id}
                  id={question.id}
                  placeholder={question.placeholder}
                  required={question.required}
                  value={answers[question.id]}
                  onChange={(e) => {
                    setAnswers((prev) => {
                      return {
                        ...prev,
                        [question.id]: e.target.value,
                      };
                    });
                  }}
                ></textarea>
              </div>
            ) : question.type === "select" ? (
              <div>
                <label htmlFor={question.id}>{question.label}</label>
                <select
                  name={question.id}
                  id={question.id}
                  required={question.required}
                  value={answers[question.id]}
                  onChange={(e) => {
                    const selectedOptions = Array.from(
                      e.target.selectedOptions,
                    ).map((opt) => opt.value);

                    setAnswers((prev) => {
                      return {
                        ...prev,
                        [question.id]: selectedOptions,
                      };
                    });
                  }}
                >
                  {question.options?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : question.type === "radio" ? (
              <fieldset>
                <legend>{question.label}</legend>
                {question.options?.map((option) => (
                  <div key={option.value} id={question.id}>
                    <input
                      type="radio"
                      id={option.value}
                      name={question.id}
                      value={option.value}
                      required={question.required}
                      onChange={(e) => {
                        setAnswers((prev) => {
                          return {
                            ...prev,
                            [question.id]: e.target.value,
                          };
                        });
                      }}
                    />
                    <label htmlFor={option.value}>{option.label}</label>
                  </div>
                ))}
              </fieldset>
            ) : question.type === "checkbox" ? (
              <fieldset>
                <legend>{question.label}</legend>
                {question.options?.map((option) => (
                  <div key={option.value}>
                    <input
                      type="checkbox"
                      id={option.value}
                      name={question.id}
                      value={option.value}
                      checked={
                        Array.isArray(answers[question.id]) &&
                        answers[question.id].includes(option.value)
                      }
                      required={question.required}
                      onChange={(e) => {
                        setAnswers((prev) => {
                          const previousValue =
                            (prev[question.id] as string[]) || [];

                          if (e.target.checked) {
                            previousValue.push(option.value);
                          } else {
                            previousValue.filter((opt) => opt !== option.value);
                          }
                          return {
                            ...prev,
                            [question.id]: previousValue,
                          };
                        });
                      }}
                    />
                    <label htmlFor={option.value}>{option.label}</label>
                  </div>
                ))}
              </fieldset>
            ) : null}
          </div>
        ))}
        <button type="submit" disabled>
          Submit
        </button>
      </form>
    </div>
  );
}
