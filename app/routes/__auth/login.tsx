import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { LoginForm } from "~/component/AuthForm/LoginForm";
import { authFormValidator } from "~/formData/authFormData";
import { validationErrorResponse } from "~/lib/validationErrorResponse.server";
import { Auth } from "~/services/authentication.server";

export const useLoginActionData = () => {
  return useActionData<typeof action>();
};

export const loader = async ({ request }: LoaderArgs) => {
  const user = await Auth.getLoggedInUser(request);
  if (user) {
    return redirect("/");
  }
  return json(null);
};

export const action = async ({ request }: ActionArgs) => {
  if (request.method === "POST") {
    const result = await authFormValidator.validate(await request.formData());
    if (result.error) {
      return validationErrorResponse(result.error);
    }

    const { username, password } = result.data;
    const loginResult = await Auth.login({ username, password });
    if (!loginResult) {
      return validationErrorResponse({
        fieldErrors: {},
        formError: "ユーザー名/パスワードの組み合わせが間違っています。",
      });
    }

    return redirect("/", {
      headers: { "Set-Cookie": loginResult.sessionCookie },
    });
  }

  return json(null);
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
