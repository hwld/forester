import { z } from "zod";

const authForm = z.object({
  username: z
    .string({ invalid_type_error: "無効なユーザー名です。" })
    .min(3, "ユーザー名は3文字以上で入力してください。")
    .max(20, "ユーザー名は20文字以内で入力してください。"),
  password: z
    .string({ invalid_type_error: "無効なパスワードです。" })
    .min(6, "パスワードは6文字以上で入力してください。"),
});

type Fields = z.infer<typeof authForm>;
type FormFieldErrors = {
  [T in keyof Fields]: string[] | undefined;
};
export type AuthActionData = {
  formError?: string;
  fieldErrors?: FormFieldErrors;
  fields?: Fields;
};

export function validateAuthForm(form: unknown): FormFieldErrors | undefined {
  const parseResult = authForm.safeParse(form);

  if (!parseResult.success) {
    const { username, password } = parseResult.error.formErrors.fieldErrors;
    return {
      username,
      password,
    };
  }

  return undefined;
}
