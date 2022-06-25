import { json } from "@remix-run/node";
import { z } from "zod";

const postForm = z
  .object({
    content: z
      .string({ invalid_type_error: "無効なコンテンツです。" })
      .min(1)
      .max(250, "コンテンツは250文字以内で入力してください。"),
  })
  .strict();

const fieldsErrors = z
  .object({ content: z.string().array().optional() })
  .strict();

const fields = z.object({ content: z.string() }).strict();

const response = z
  .object({
    formError: z.string().optional(),
    fieldErrors: fieldsErrors.optional(),
    fields: fields.optional(),
  })
  .strict();

export const PostSchema = { response };
export type PostForm = z.infer<typeof postForm>;
type FormFieldsErrors = z.infer<typeof fieldsErrors>;
export type PostFormResponse = z.infer<typeof response>;

export const postFormResponse = (
  data: PostFormResponse,
  init: Parameters<typeof json>[1]
) => {
  const result = response.safeParse(data);
  if (!result.success) {
    throw new Error("サーバーでエラーが発生しました。");
  }
  return json<PostFormResponse>(data, init);
};

export const validatePostForm = (
  form: unknown
): FormFieldsErrors | undefined => {
  const parseResult = postForm.safeParse(form);

  if (!parseResult.success) {
    const { content } = parseResult.error.formErrors.fieldErrors;
    return {
      content,
    };
  }

  return undefined;
};
