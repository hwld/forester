import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { findPost } from "~/models/post";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";

export const loader = async () => {
  return redirect("/");
};

export const action = async ({ request, params }: ActionArgs) => {
  if (request.method === "DELETE") {
    const user = await requireUser(request);

    const post = await findPost({ where: { id: params.id, userId: user.id } });
    if (!post) {
      return json(null, { status: 400 });
    }

    const deleted = await db.post.delete({ where: { id: params.id } });
    return json({ deletedId: deleted.id });
  }
  return null;
};
