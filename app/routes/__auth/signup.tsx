import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { SignupForm } from "~/component/AuthForm/SIgnupForm";
import type { AuthFormValidationError } from "~/form/authForm";
import { validateAuthForm } from "~/form/authForm";
import { db } from "~/utils/db.server";
import { registerUser } from "~/utils/session.server";

type SignupErrorResponse = {
  type: "error";
  error: AuthFormValidationError;
};
type SignupSuccessResponse = undefined;
type SignupResponse = SignupErrorResponse | SignupSuccessResponse;

export const useSignupActionData = () => {
  return useActionData<SignupResponse>();
};

export const loader: LoaderFunction = async () => {
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "POST") {
    const validResult = validateAuthForm(await request.formData());
    if (validResult.type === "error") {
      return json<SignupErrorResponse>({
        type: "error",
        error: validResult.error,
      });
    }

    const { username, password } = validResult.data;
    const userExists = await db.user.findUnique({ where: { username } });
    if (userExists) {
      return json<SignupErrorResponse>({
        type: "error",
        error: {
          fields: { username },
          formError: `ユーザー名 ${username} はすでに使用されています。`,
        },
      });
    }

    const { sessionCookie } = await registerUser({ username, password });
    return redirect("/", { headers: { "Set-Cookie": sessionCookie } });
  }
  return null;
};

export default function Signup() {
  return (
    <>
      <SignupForm />
      <p className="self-start mt-1">
        アカウントをお持ちの方は{" "}
        <Link to="/login" className="text-emerald-500 font-bold underline">
          ログインへ
        </Link>
      </p>
    </>
  );
}
