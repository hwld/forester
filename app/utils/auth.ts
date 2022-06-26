import { json } from "@remix-run/node";
import { z } from "zod";

const authFormBase = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .strict();
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

const errorResponse = z
  .object({
    formError: z.string().optional(),
    fieldErrors: z
      .object({
        username: z.string().array().optional(),
        password: z.string().array().optional(),
      })
      .strict()
      .optional(),
    fields: z.object({ username: z.string() }).strict().optional(),
  })
  .strict();

const successResponse = z.undefined();

const response = z.discriminatedUnion("type", [
  z.object({ type: z.literal("error"), error: errorResponse }),
  z.object({ type: z.literal("ok"), data: successResponse }),
]);

export const AuthSchema = { response };

export type AuthForm = z.infer<typeof authForm>;
export type ErrorAuthResponse = z.infer<typeof errorResponse>;
export type SuccessAuthResponse = z.infer<typeof successResponse>;
export type AuthResponse = z.infer<typeof response>;

type ValidateAuthFormResult =
  | { type: "error"; error: ErrorAuthResponse }
  | { type: "ok"; data: AuthForm };
export const validateAuthForm = (
  formData: FormData
): ValidateAuthFormResult => {
  const form = Object.fromEntries(Array.from(formData));

  const typeValidResult = authFormBase.safeParse(form);
  if (!typeValidResult.success) {
    return {
      type: "error",
      error: { formError: "フォームが正しく送信されませんでした。" },
    };
  }

  const typeValidated = typeValidResult.data;
  const validResult = authForm.safeParse(typeValidated);
  if (!validResult.success) {
    const { fieldErrors } = validResult.error.flatten();
    return {
      type: "error",
      error: {
        fieldErrors,
        fields: { username: typeValidated.username },
      },
    };
  }

  return { type: "ok", data: validResult.data };
};

export const authResponse = (
  data: AuthResponse,
  init: Parameters<typeof json>[1]
) => {
  const result = response.safeParse(data);
  if (!result.success) {
    throw new Error("サーバーでエラーが発生しました。");
  }
  return json<AuthResponse>(data, init);
};
