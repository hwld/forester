import { z } from "zod";

export const baseUserFormData = z.object({
  username: z
    .string({ invalid_type_error: "無効なユーザー名です。" })
    .min(3, "ユーザー名は3文字以上で入力してください。")
    .max(20, "ユーザー名は20文字以内で入力してください。"),
  profile: z
    .string({ invalid_type_error: "無効なプロフィールです。" })
    .max(150, "プロフィールは150文字以内で入力してください。"),
});
