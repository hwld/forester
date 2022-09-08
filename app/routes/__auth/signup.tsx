import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { SignupForm } from "~/component/AuthForm/SIgnupForm";
import { authFormValidator } from "~/formData/authFormData";
import { findUser } from "~/models/user/finder.server";
import { Auth } from "~/services/authentication.server";

// TODO:
// repopulateFieldsに型がつかない・・・ (参考: https://github.com/remix-run/remix/issues/3931)
// issueのコメントにあるremix-typedjsonを使ってみる
export const useSignupActionData = () => {
  return useActionData<typeof action>();
};

export const loader = async () => {
  return json(null);
};

export const action = async ({ request }: ActionArgs) => {
  if (request.method === "POST") {
    const result = await authFormValidator.validate(await request.formData());
    if (result.error) {
      return validationError(result.error);
    }

    const { username, password } = result.data;
    const userExists = await findUser({ where: { username } });
    if (userExists) {
      return validationError(
        { fieldErrors: {} },
        { formError: `ユーザー名 ${username} はすでに使用されています。` }
      );
    }

    const { sessionCookie } = await Auth.registerUser({ username, password });
    return redirect("/", { headers: { "Set-Cookie": sessionCookie } });
  }

  return json(null);
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
