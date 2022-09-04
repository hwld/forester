import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import type { UseDataFunctionReturn } from "@remix-run/react/dist/components";
import type { CreatePostFormValidationError } from "~/formData/createPostFormData";
import { validateCreatePostForm } from "~/formData/createPostFormData";
import { findPost } from "~/models/post/finder.server";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";

type PostErrorResponse = {
  type: "error";
  error: CreatePostFormValidationError;
};
type PostSuccessResponse = {
  type: "ok";
  data: { postId: string; content: string };
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
  const user = await requireUser(request);

  if (request.method === "POST") {
    const result = validateCreatePostForm(await request.formData());
    if (result.type === "error") {
      return json<PostErrorResponse>({ type: "error", error: result.error });
    }

    const { replySourceId, content } = result.data;

    // replySourceIdが指定されている場合、その投稿が存在するかチェックする
    if (replySourceId) {
      const postExists = await findPost({ where: { id: replySourceId } });
      if (!postExists) {
        return json<PostErrorResponse>({
          type: "error",
          error: {
            fields: { content, replySourceId },
            formError: "存在しない投稿に返信しようとしています。",
          },
        });
      }
    }

    const created = await db.post.create({
      data: { content, userId: user.id, replySourcePostId: replySourceId },
    });
    return json<PostSuccessResponse>({
      type: "ok",
      data: { postId: created.id, content: created.content },
    });
  }

  return json(undefined, { status: 405 });
};
