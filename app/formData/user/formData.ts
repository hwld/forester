import { File } from "@remix-run/node/dist/fetch";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { baseUserFormData } from "./base";

const clientUserFormData = baseUserFormData.and(
  z.object({
    icon: z.instanceof(File),
  })
);
export const clientUserFormValidator = withZod(clientUserFormData);
