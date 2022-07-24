import { NodeOnDiskFile } from "@remix-run/node";
import { File } from "@remix-run/node/dist/fetch";
import { z } from "zod";
import type { ExtractValidationError } from "~/lib/formValidator";
import { createValidator } from "~/lib/formValidator";

const userFormData = z
  .object({
    icon: z.instanceof(NodeOnDiskFile).or(z.instanceof(File)),
    username: z
      .string({ invalid_type_error: "無効なユーザー名です。" })
      .min(3, "ユーザー名は3文字以上で入力してください。")
      .max(20, "ユーザー名は20文字以内で入力してください。"),
    profile: z
      .string({ invalid_type_error: "無効なプロフィールです。" })
      .max(150, "プロフィールは150文字以内で入力してください。"),
  })
  .strict();

export type UserFormData = z.infer<typeof userFormData>;

export const validateUserForm = createValidator(userFormData);

export type UserFormValidationError = ExtractValidationError<
  ReturnType<typeof validateUserForm>
>;
