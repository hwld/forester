import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { AuthForm } from "~/component/AuthForm/AuthForm";
import type { AuthFormValidationError } from "~/form/authForm";
import type { ErrorAuthResponse } from "~/utils/auth";
import { authResponse, validateAuthForm } from "~/utils/auth";
import { getUser, login } from "~/utils/session.server";

type AuthErrorResponse = {
  type: "error";
  error: AuthFormValidationError;
};

const badRequest = (error: ErrorAuthResponse) => {
  return authResponse({ type: "error", error }, { status: 400 });
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) {
    return redirect("/");
  }
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "POST") {
    const validResult = validateAuthForm(await request.formData());
    if (validResult.type === "error") {
      return badRequest(validResult.error);
    }

    const { username, password } = validResult.data;
    const loginResult = await login({ username, password });
    if (!loginResult) {
      return badRequest({
        fields: { username },
        formError: "ユーザー名/パスワードの組み合わせが間違っています。",
      });
    }

    return redirect("/", {
      headers: { "Set-Cookie": loginResult.sessionCookie },
    });
  }

  return null;
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
