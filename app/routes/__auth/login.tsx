import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { LoginForm } from "~/component/AuthForm/LoginForm";
import type { AuthFormValidationError } from "~/form/authForm";
import { validateAuthForm } from "~/form/authForm";
import { getUser, login } from "~/utils/session.server";

type LoginErrorResponse = {
  type: "error";
  error: AuthFormValidationError;
};
type LoginSuccessResponse = undefined;
type LoginResponse = LoginErrorResponse | LoginSuccessResponse;

export const useLoginActionData = () => {
  return useActionData<LoginResponse>();
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
      return json<LoginErrorResponse>({
        type: "error",
        error: validResult.error,
      });
    }

    const { username, password } = validResult.data;
    const loginResult = await login({ username, password });
    if (!loginResult) {
      return json<LoginErrorResponse>({
        type: "error",
        error: {
          fields: { username },
          formError: "ユーザー名/パスワードの組み合わせが間違っています。",
        },
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
      <LoginForm />
      <p className="self-start mt-1">
        初めての方は{" "}
        <Link to="/signup" className="text-emerald-500 font-bold underline">
          ユーザー登録へ
        </Link>
      </p>
    </>
  );
}
