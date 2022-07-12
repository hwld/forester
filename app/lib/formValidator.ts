import type { ZodSchema } from "zod";

// keyof Tって書くと Tがわからないときにstring |number |symbolと推論される。
// zod側ではこんな感じの定義が使われてて、string | number | symbolが割り当てられないってエラーが出る
// 同じ型を使うことでエラーはなくなったが、理由がよくわかっていない
type allKeys<T> = T extends any ? keyof T : never;

type ValidationError<T, OutputFields = T> = {
  formError?: string;
  fieldErrors?: { [K in allKeys<T>]?: string[] };
  fields?: OutputFields;
};

type ValidationResult<T, ErrorOutPutFields> =
  | { type: "error"; error: ValidationError<T, ErrorOutPutFields> }
  | { type: "ok"; data: T };

export type ExtractValidationError<
  T extends ValidationResult<unknown, unknown>
> = T extends { type: "error" } ? T["error"] : never;

export const createValidator = <T, ErrorOutPutFields = T>(
  schema: ZodSchema<T>,
  errorOutputFieldsFilter: (fields: T) => ErrorOutPutFields = (fields) =>
    fields as unknown as ErrorOutPutFields
) => {
  const validator = (
    formData: FormData
  ): ValidationResult<T, ErrorOutPutFields> => {
    const form = Object.fromEntries(Array.from(formData));

    const validationResult = schema.safeParse(form);
    if (validationResult.success) {
      return { type: "ok", data: validationResult.data };
    }

    const issues = validationResult.error.issues;
    if (issues.some((issue) => issue.code === "invalid_type")) {
      return {
        type: "error",
        error: { formError: "フォームが正しく送信されませんでした。" },
      };
    }

    const { fieldErrors } = validationResult.error.flatten();
    // ここを実行しているということは、formの型エラーがないということなので、
    // Tを満たすオブジェクトは取得できる？
    const fields = form as unknown as T;
    const output = errorOutputFieldsFilter(fields);
    return {
      type: "error",
      error: { fieldErrors: fieldErrors, fields: output },
    };
  };

  return validator;
};
