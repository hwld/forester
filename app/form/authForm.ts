import { z } from "zod";
import type { ExtractValidationError } from "~/lib/formValidator";
import { createValidator } from "~/lib/formValidator";

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

export const validateAuthForm = createValidator(authForm, (fields) => ({
  username: fields.username,
}));

export type AuthFormValidationError = ExtractValidationError<
  ReturnType<typeof validateAuthForm>
>;
