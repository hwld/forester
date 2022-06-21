import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }

  if (request.method === "POST") {
    const form = await request.formData();
    const content = form.get("content");

    if (typeof content !== "string") {
      return json({}, { status: 400 });
    }

    const created = await db.post.create({
      data: { userId: user.id, content },
    });
    return json({ post: created });
  }

  return null;
};
