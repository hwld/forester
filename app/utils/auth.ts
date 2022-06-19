import { z } from "zod";

const authForm = z
  .object({
    username: z
      .string({ invalid_type_error: "無効なユーザー名です。" })
      .min(3, "ユーザー名は3文字以上で入力してください。")
      .max(20, "ユーザー名は20文字以内で入力してください。"),
    password: z
      .string({ invalid_type_error: "無効なパスワードです。" })
      .min(6, "パスワードは6文字以上で入力してください。"),
  })
  .strict();

const formFieldErrors = z
  .object({
    username: z.string().array().optional(),
    password: z.string().array().optional(),
  })
  .strict();

const fields = z.object({ username: z.string() }).strict();

const authActionData = z
  .object({
    formError: z.string().optional(),
    fieldErrors: formFieldErrors.optional(),
    fields: fields.optional(),
  })
  .strict();

export const AuthSchema = { authActionData };

export type AuthForm = z.infer<typeof authForm>;
type FormFieldErrors = z.infer<typeof formFieldErrors>;
export type AuthActionData = z.infer<typeof authActionData>;

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
