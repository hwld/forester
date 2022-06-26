import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { AuthForm } from "~/component/AuthForm/AuthForm";
import type { ErrorAuthResponse } from "~/utils/auth";
import { authResponse, validateAuthForm } from "~/utils/auth";
import { db } from "~/utils/db.server";
import { registerUser } from "~/utils/session.server";

const badRequest = (error: ErrorAuthResponse) => {
  return authResponse({ type: "error", error }, { status: 400 });
};

export const loader: LoaderFunction = async () => {
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method === "POST") {
    const validResult = validateAuthForm(await request.formData());
    if (validResult.type === "error") {
      return badRequest(validResult.error);
    }

    const { username, password } = validResult.data;
    const userExists = await db.user.findUnique({ where: { username } });
    if (userExists) {
      return badRequest({
        fields: { username },
        formError: `ユーザー名 ${username} はすでに使用されています。`,
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
