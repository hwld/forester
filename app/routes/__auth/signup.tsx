import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { AuthForm } from "~/component/authForm/AuthForm";
import type { AuthActionData } from "~/utils/auth";
import { validateAuthForm } from "~/utils/auth";
import { db } from "~/utils/db.server";
import { createUserSession, registerUser } from "~/utils/session.server";

const badRequest = (data: AuthActionData) => {
  return json(data, { status: 400 });
};

export const loader: LoaderFunction = async () => {
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  if (typeof username !== "string" || typeof password !== "string") {
    return badRequest({ formError: "フォームが正しく送信されませんでした。" });
  }

  const fieldErrors = validateAuthForm({ username, password });
  if (fieldErrors) {
    return badRequest({ fields: { username }, fieldErrors });
  }

  const userExists = await db.user.findUnique({ where: { username } });
  if (userExists) {
    return badRequest({
      fields: { username },
      formError: `ユーザー名 ${username} はすでに使用されています。`,
    });
  }

  const { userId } = await registerUser({ username, password });
  const setCookieHeader = await createUserSession(userId);
  return redirect("/", { headers: { "Set-Cookie": setCookieHeader } });
};

export default function Signup() {
  return (
    <>
      <AuthForm type="signup" />
      <p className="self-start mt-1">
        アカウントをお持ちの方は{" "}
        <Link to="/login" className="text-emerald-500 font-bold underline">
          ログインへ
        </Link>
      </p>
    </>
  );
}
