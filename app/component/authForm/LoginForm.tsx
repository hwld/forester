import { Form, useTransition } from "@remix-run/react";
import { useMemo } from "react";
import { useLoginActionData } from "~/routes/__auth/login";
import { AuthFormHeader } from "./AuthFormHeader";
import { AuthInput } from "./AuthInput";
import { AuthSubmitButton } from "./AuthSubmitButton";

type Props = {};

export const LoginForm: React.VFC<Props> = () => {
  const actionData = useLoginActionData();
  const transition = useTransition();

  const error = useMemo(() => {
    if (actionData?.type === "error") {
      return actionData.error;
    }
  }, [actionData]);

  return (
    <div>
      <AuthFormHeader type={"login"} />
      <Form
        action={"/login"}
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
              autoComplete={"current-password"}
            />
          </div>
          <div className="mt-5">
            <AuthSubmitButton
              text={"ログイン"}
              isSubmitting={transition.state === "submitting"}
            />
          </div>
        </fieldset>
      </Form>
    </div>
  );
};
