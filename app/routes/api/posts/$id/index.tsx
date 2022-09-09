import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { db } from "~/lib/db.server";
import { findPost } from "~/models/post/finder.server";
import { Auth } from "~/services/authentication.server";

export const loader = async () => {
  return redirect("/");
};

export const action = async ({ request, params }: ActionArgs) => {
  if (request.method === "DELETE") {
    const user = await Auth.requireUser(request);

    const post = await findPost({
      where: { id: params.id, userId: user.id },
      loggedInUserId: user.id,
    });
    if (!post) {
      return json(null, { status: 400 });
    }

    const deleted = await db.post.delete({ where: { id: params.id } });
    return json({ deletedId: deleted.id });
  }
  return null;
};
