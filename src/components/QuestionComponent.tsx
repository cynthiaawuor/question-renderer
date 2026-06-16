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
    <div className="min-h-screen mx-auto max-w-3xl my-8 flex flex-col items-center justify-center px-4 py-8 rounded-2xl bg-gray-50 p-8 shadow-md placeholder:text-gray-50">
      <h1 className="text-3xl font-bold my-4">Fill in the form below</h1>
      <form action="" onSubmit={onSubmit} className="flex flex-col gap-3">
        {questions.map((question) => (
          <div key={question.id}>
            {question.type === "text" ? (
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={question.id}
                  className="text-sm font-medium text-gray-700"
                >
                  {question.label}
                </label>
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
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 shadow-sm transition focus:border-red-200 focus:outline-none focus:ring-1 focus:ring-red-200"
                />
              </div>
            ) : question.type === "textarea" ? (
              <div>
                <label
                  htmlFor={question.id}
                  className="text-sm font-medium text-gray-700"
                >
                  {question.label}
                </label>
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
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 shadow-sm transition focus:border-red-200 focus:outline-none focus:ring-1 focus:ring-red-200"
                ></textarea>
              </div>
            ) : question.type === "select" ? (
              <div>
                <label
                  htmlFor={question.id}
                  className="text-sm font-medium text-gray-700"
                >
                  {question.label}
                </label>
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
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900 shadow-sm transition focus:border-red-200 focus:outline-none focus:ring-1 focus:ring-red-200"
                >
                  {question.options?.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : question.type === "radio" ? (
              <fieldset className="rounded-lg border border-gray-200 p-4">
                <legend className="text-sm font-medium text-gray-700 px-1">
                  {question.label}
                </legend>
                {question.options?.map((option) => (
                  <div
                    key={option.value}
                    id={question.id}
                    className="flex cursor-pointer items-center gap-3 rounded-sm px-2 py-2 hover:bg-gray-100"
                  >
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
                      className="accent-red-600"
                    />
                    <label
                      htmlFor={option.value}
                      className="text-sm font-medium text-gray-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </fieldset>
            ) : question.type === "checkbox" ? (
              <fieldset className="border border-gray-200 rounded-md p-4">
                <legend className="text-sm font-medium text-gray-700 px-1">
                  {question.label}
                </legend>
                {question.options?.map((option) => (
                  <div
                    key={option.value}
                    className="flex cursor-pointer items-center gap-3 rounded-sm px-2 py-2 hover:bg-gray-100"
                  >
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

                          const updatedValue = e.target.checked
                            ? [...previousValue, option.value]
                            : previousValue.filter(
                                (opt) => opt !== option.value,
                              );
                          return {
                            ...prev,
                            [question.id]: updatedValue,
                          };
                        });
                      }}
                      className="accent-red-600"
                    />
                    <label
                      htmlFor={option.value}
                      className="text-sm font-medium text-gray-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </fieldset>
            ) : null}
          </div>
        ))}
        <button
          type="submit"
          disabled={Object.keys(answers).length !== questions.length}
          className="cursor-pointer mt-4 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-red-600/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
