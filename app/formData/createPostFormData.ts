import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

const createPostFormData = z
  .object({
    content: z
      .string()
      .min(1, "1文字以上入力してください。")
      .max(250, "250文字以内で入力してください。"),
    replySourceId: z.string().optional(),
  })
  .strict();

export const createPostFormValidator = withZod(createPostFormData);
