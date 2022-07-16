import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import type { CreatePostFormValidationError } from "~/formData/createPostFormData";
import { validateCreatePostForm } from "~/formData/createPostFormData";
import { findPost } from "~/models/post";
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
type PostResponse = PostSuccessResponse | PostErrorResponse;

export const usePostFetcher = () => {
  // loaderもactionも呼ばれる可能性があるのでどちらの型も含める。
  // 現状、loaderやactionの戻り値はResponse型で、返ってくるデータの型が
  // インターフェースに現れないので手動でつけている。
  // 将来的に https://github.com/remix-run/remix/pull/3276 がマージされればtypeofで書けるようになると思う
  type LoaderReturnType = undefined;
  type ActionReturnType = PostResponse;
  return useFetcher<LoaderReturnType | ActionReturnType>();
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
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

  return null;
};
