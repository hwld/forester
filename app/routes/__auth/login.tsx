import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { AuthForm } from "~/component/authForm/AuthForm";
import type { AuthActionData } from "~/utils/auth";
import { validateAuthForm } from "~/utils/auth";
import { createUserSession, getUser, login } from "~/utils/session.server";

const badRequest = (data: AuthActionData) => {
  return json(data, { status: 400 });
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) {
    return redirect("/");
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  // 入力された値の形式を確認する
  if (typeof username !== "string" || typeof password !== "string") {
    return badRequest({
      formError: "フォームが正しく送信されませんでした。",
    });
  }

  const fieldErrors = validateAuthForm({ username, password });
  if (fieldErrors) {
    return badRequest({ fieldErrors, fields: { username } });
  }

  const user = await login({ username, password });
  if (!user) {
    return badRequest({
      fields: { username },
      formError: "ユーザー名/パスワードの組み合わせが間違っています。",
    });
  }

  const setCookieHeader = await createUserSession(user.id);
  return redirect("/", { headers: { "Set-Cookie": setCookieHeader } });
};

export default function Login() {
  return (
    <>
      <AuthForm type="login" />
      <p className="self-start mt-1">
        初めての方は{" "}
        <Link to="/signup" className="text-emerald-500 font-bold underline">
          ユーザー登録へ
        </Link>
      </p>
    </>
  );
}
