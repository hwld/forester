import { z } from "zod";
import type { ExtractValidationError } from "~/lib/formValidator";
import { createValidator } from "~/lib/formValidator";

const createPostFormData = z
  .object({
    content: z
      .string()
      .min(1, "1文字以上入力してください。")
      .max(250, "250文字以内で入力してください。"),
    replySourceId: z.string().optional(),
  })
  .strict();

export const validateCreatePostForm = createValidator(createPostFormData);

export type CreatePostFormValidationError = ExtractValidationError<
  ReturnType<typeof validateCreatePostForm>
>;
