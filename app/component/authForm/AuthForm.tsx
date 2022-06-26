import { Form, useActionData, useTransition } from "@remix-run/react";
import { useMemo } from "react";
import type { AuthResponse } from "~/utils/auth";
import { AuthFormHeader } from "./AuthFormHeader";
import { AuthInput } from "./AuthInput";
import { AuthSubmitButton } from "./AuthSubmitButton";

type Props = { type: "login" | "signup" };

export const AuthForm: React.VFC<Props> = ({ type }) => {
  const actionData = useActionData<AuthResponse>();
  const transition = useTransition();
  const isLoginType = type === "login";

  const error = useMemo(() => {
    if (actionData?.type === "error") {
      return actionData.error;
    }
  }, [actionData]);

  return (
    <div>
      <AuthFormHeader type={type} />
      <Form
        action={type === "login" ? "/login" : "/signup"}
        method="post"
        className="mt-5 p-5 bg-white shadow-md rounded-md"
      >
        <fieldset disabled={transition.state === "submitting"}>
          {error?.formError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error?.formError}</p>
            </div>
          )}
          <div className="mt-5 space-y-4">
            <AuthInput
              label="ユーザー名"
              type="text"
              name="username"
              defaultValue={error?.fields?.username}
              errors={error?.fieldErrors?.username}
              autoComplete="username"
            />
            <AuthInput
              label="パスワード"
              type="password"
              name="password"
              errors={error?.fieldErrors?.password}
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
