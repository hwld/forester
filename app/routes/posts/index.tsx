import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import type { PostFormResponse } from "~/utils/post";
import { postFormResponse, validatePostForm } from "~/utils/post";
import { requireUser } from "~/utils/session.server";

export const loader: LoaderFunction = async () => {
  return redirect("/");
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);

  switch (request.method) {
    case "POST": {
      const formData = await request.formData();
      const response = await postPost(formData, user.id);
      return response;
    }
  }

  return null;
};

const badRequest = (data: PostFormResponse) => {
  return postFormResponse(data, { status: 400 });
};

const postPost = async (formData: FormData, userId: string) => {
  const content = formData.get("content");

  if (typeof content !== "string") {
    return badRequest({ formError: "フォームが正しく送信されませんでした。" });
  }

  const fieldErrors = validatePostForm({ content });
  if (fieldErrors) {
    return badRequest({ fieldErrors, fields: { content } });
  }

  const created = await db.post.create({ data: { content, userId } });
  return json(created);
};
