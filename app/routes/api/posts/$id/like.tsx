import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { db } from "~/lib/db.server";
import { findPost } from "~/models/post/finder.server";
import { Auth } from "~/services/authentication.server";

export const loader = async () => {
  return redirect("/");
};

export const action = async ({ request, params }: ActionArgs) => {
  const user = await Auth.requireUser(request);

  const post = await findPost({
    where: { id: params.id },
    loggedInUserId: user.id,
  });
  if (!post) {
    return json(null, { status: 400 });
  }

  const like = await db.like.findFirst({
    where: { postId: post.post.id, userId: user.id },
  });

  // すでに いいね していれば削除、していなければ いいね する
  if (like) {
    await db.like.delete({ where: { id: like.id } });
  } else {
    await db.like.create({
      data: { postId: post.post.id, userId: user.id },
    });
  }

  return json(null);
};
