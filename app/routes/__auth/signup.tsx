import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { AuthForm } from "~/component/authForm/AuthForm";
import type { AuthActionData } from "~/utils/auth";
import { AuthSchema, validateAuthForm } from "~/utils/auth";
import { db } from "~/utils/db.server";
import { registerUser } from "~/utils/session.server";

const authResponse = (
  data: AuthActionData,
  init: Parameters<typeof json>[1]
) => {
  const result = AuthSchema.authActionData.safeParse(data);
  if (!result.success) {
    throw new Error("サーバーでエラーが発生しました。");
  }
  return json(data, init);
};

const badRequest = (data: AuthActionData) => {
  return authResponse(data, { status: 400 });
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

  const { sessionCookie } = await registerUser({ username, password });
  return redirect("/", { headers: { "Set-Cookie": sessionCookie } });
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
