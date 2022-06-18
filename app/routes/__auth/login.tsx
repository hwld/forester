import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { AuthForm } from "~/component/authForm/AuthForm";
import { validatePassword, validateUserName } from "~/utils/auth.server";
import { createUserSession, login } from "~/utils/session.server";
import type { AuthActionData } from "../__auth";

const badRequest = (data: AuthActionData) => {
  return json(data, { status: 400 });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  if (typeof username !== "string" || typeof password !== "string") {
    return badRequest({
      formError: "フォームが正しく送信されませんでした。",
    });
  }

  const fields = { username, password };
  const fieldErrors = {
    username: validateUserName(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  const user = await login({ username, password });
  if (!user) {
    return badRequest({
      fields,
      formError: "ユーザー名/パスワードの組み合わせが間違っています。",
    });
  }
  return createUserSession(user.id);
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
