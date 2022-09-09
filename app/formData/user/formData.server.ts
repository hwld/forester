import { NodeOnDiskFile } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { baseUserFormData } from "./base";

const serverUserFormData = baseUserFormData.and(
  z.object({
    // アイコンに変更がなければFileとして渡ってくる。
    // 新しいアイコンが選択されたときにはNodeOnDiskFileとして渡ってくる。
    icon: z.instanceof(File).or(z.instanceof(NodeOnDiskFile)),
  })
);
export const serverUserFormValidator = withZod(serverUserFormData);
