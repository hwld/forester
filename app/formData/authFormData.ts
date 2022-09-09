import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

const authFormData = z
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

export type AuthFormData = z.infer<typeof authFormData>;

export const authFormValidator = withZod(authFormData);
