import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import type { ErrorPostResponse, SuccessPostResponse } from "~/utils/post";
import { postResponse, validatePostForm } from "~/utils/post";
import { requireUser } from "~/utils/session.server";

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);

  if (request.method === "POST") {
    const result = validatePostForm(await request.formData());
    if (result.type === "error") {
      return badRequest(result.error);
    }

    const { content } = result.data;
    const created = await db.post.create({
      data: { content, userId: user.id },
    });
    return ok({ createdPost: { id: created.id, content: created.content } });
  }

  return null;
};

const badRequest = (error: ErrorPostResponse) => {
  return postResponse({ type: "error", error }, { status: 400 });
};

const ok = (data: SuccessPostResponse) => {
  return postResponse({ type: "ok", data });
};
