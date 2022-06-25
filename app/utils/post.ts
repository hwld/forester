import { json } from "@remix-run/node";
import { z } from "zod";

const postFormBase = z.object({ content: z.string() });
const postForm = z
  .object({
    content: z
      .string()
      .min(1, "コンテンツは1文字以上入力してください。")
      .max(250, "コンテンツは250文字以内で入力してください。"),
  })
  .strict();

const fieldsErrors = z
  .object({ content: z.string().array().optional() })
  .strict();

const fields = z.object({ content: z.string() }).strict();

const errorResponse = z
  .object({
    formError: z.string().optional(),
    fieldErrors: fieldsErrors.optional(),
    fields: fields.optional(),
  })
  .strict();
const successResponse = z.object({
  createdPost: z.object({ id: z.string(), content: z.string() }),
});

const response = z.discriminatedUnion("type", [
  z.object({ type: z.literal("error"), error: errorResponse }),
  z.object({ type: z.literal("ok"), data: successResponse }),
]);

export const PostSchema = { response };

export type PostForm = z.infer<typeof postForm>;
export type ErrorPostResponse = z.infer<typeof errorResponse>;
export type SuccessPostResponse = z.infer<typeof successResponse>;
export type PostResponse = z.infer<typeof response>;

export const validatePostForm = (
  formData: FormData
):
  | { type: "error"; error: ErrorPostResponse }
  | { type: "ok"; data: PostForm } => {
  const form = Object.fromEntries(Array.from(formData));

  const typeValidResult = postFormBase.safeParse(form);
  if (!typeValidResult.success) {
    return {
      type: "error",
      error: { formError: "フォームが正しく送信されませんでした。" },
    };
  }

  const typeValidated = typeValidResult.data;
  const validResult = postForm.safeParse(typeValidated);
  if (!validResult.success) {
    const fieldErrors = validResult.error.flatten().fieldErrors;
    return {
      type: "error",
      error: {
        fieldErrors,
        fields: { content: typeValidated.content },
      },
    };
  }

  const validated = validResult.data;
  return { type: "ok", data: validated };
};

export const postResponse = (
  data: PostResponse,
  init?: Parameters<typeof json>[1]
) => {
  const result = response.safeParse(data);
  if (!result.success) {
    throw new Error("サーバーでエラーが発生しました。");
  }
  return json<PostResponse>(data, init);
};
