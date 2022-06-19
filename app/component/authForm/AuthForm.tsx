import { Form, useActionData, useTransition } from "@remix-run/react";
import type { AuthActionData } from "~/utils/auth";
import { AuthFormHeader } from "./AuthFormHeader";
import { AuthInput } from "./AuthInput";
import { AuthSubmitButton } from "./AuthSubmitButton";

type Props = { type: "login" | "signup" };

export const AuthForm: React.VFC<Props> = ({ type }) => {
  const actionData = useActionData<AuthActionData>();
  const transition = useTransition();
  const isLoginType = type === "login";

  return (
    <div>
      <AuthFormHeader type={type} />
      <Form method="post" className="mt-5 p-5 bg-white shadow-md rounded-md">
        <fieldset disabled={transition.state === "submitting"}>
          {actionData?.formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{actionData?.formError}</p>
            </div>
          )}
          <div className="mt-5 space-y-4">
            <AuthInput
              label="ユーザー名"
              type="text"
              name="username"
              defaultValue={actionData?.fields?.username}
              errors={actionData?.fieldErrors?.username}
              autoComplete="username"
            />
            <AuthInput
              label="パスワード"
              type="password"
              name="password"
              errors={actionData?.fieldErrors?.password}
              autoComplete={isLoginType ? "current-password" : "new-password"}
            />
          </div>
          <div className="mt-5">
            <AuthSubmitButton
              text={isLoginType ? "ログイン" : "登録"}
              isSubmitting={transition.state === "submitting"}
            />
          </div>
        </fieldset>
      </Form>
    </div>
  );
};
