import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import type { UseDataFunctionReturn } from "@remix-run/react/dist/components";
import { useActionData } from "@remix-run/react/dist/components";
import { createPostFormValidator } from "~/formData/createPostFormData";
import { db } from "~/lib/db.server";
import { validationErrorResponse } from "~/lib/validationErrorResponse.server";
import { findPost } from "~/models/post/finder.server";
import { Auth } from "~/services/authentication.server";

export const usePostActionData = () => {
  return useActionData<typeof action>();
};

export const usePostFetcher = () => {
  type LoaderReturnType = UseDataFunctionReturn<typeof loader>;
  type ActionReturnType = UseDataFunctionReturn<typeof action>;
  return useFetcher<LoaderReturnType | ActionReturnType>();
};

export const loader = async () => {
  return redirect("/");
};

export const action = async ({ request }: ActionArgs) => {
  const user = await Auth.requireUser(request);

  if (request.method === "POST") {
    const result = await createPostFormValidator.validate(
      await request.formData()
    );
    if (result.error) {
      return validationErrorResponse(result.error);
    }

    const { replySourceId, content } = result.data;

    // replySourceIdが指定されている場合、その投稿が存在するかチェックする
    if (replySourceId) {
      const postExists = await findPost({
        where: { id: replySourceId },
        loggedInUserId: user.id,
      });
      if (!postExists) {
        return validationErrorResponse({
          fieldErrors: {},
          formError: "存在しない投稿に返信しようとしています。",
        });
      }
    }

    await db.post.create({
      data: { content, userId: user.id, replySourcePostId: replySourceId },
    });
    return json(null);
  }

  return json(null);
};
