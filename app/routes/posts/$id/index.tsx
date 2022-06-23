import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
export const action: ActionFunction = async ({ request, params }) => {
  if (request.method === "DELETE") {
    const user = await requireUser(request);

    const post = await db.post.findFirst({
      where: { id: params.id, userId: user.id },
    });
    if (!post) {
      return json(null, { status: 400 });
    }

    const deleted = await db.post.delete({ where: { id: params.id } });
    return json({ deletedId: deleted.id });
  }
  return null;
};
