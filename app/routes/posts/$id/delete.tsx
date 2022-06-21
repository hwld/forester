import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
export const action: ActionFunction = async ({ params, request }) => {
  const user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }

  const post = await db.post.findFirst({
    where: { id: params.id, userId: user.id },
  });
  if (!post) {
    return json({}, { status: 400 });
  }

  const deleted = await db.post.delete({ where: { id: params.id } });
  return json({ deletedId: deleted.id });
};
