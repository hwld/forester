import { Form, useTransition } from "@remix-run/react";
import { useMemo } from "react";
import { useSignupActionData } from "~/routes/__auth/signup";
import { Button } from "../Button";
import { FormError } from "../FormError";
import { FormInput } from "../FormInput";
import { AuthFormHeader } from "./AuthFormHeader";

type Props = {};

export const SignupForm: React.VFC<Props> = () => {
  const actionData = useSignupActionData();
  const transition = useTransition();

  const error = useMemo(() => {
    if (actionData?.type === "error") {
      return actionData.error;
    }
  }, [actionData]);

  return (
    <div>
      <AuthFormHeader type={"signup"} />
      <Form
        action={"/signup"}
        method="post"
        className="mt-5 p-5 bg-white shadow-md rounded-md"
      >
        <fieldset disabled={transition.state === "submitting"}>
          {error?.formError && <FormError message={error.formError} />}
          <div className="mt-5 space-y-4">
            <FormInput
              label="ユーザー名"
              type="text"
              name="username"
              defaultValue={error?.fields?.username}
              errors={error?.fieldErrors?.username}
              autoComplete="username"
            />
            <FormInput
              label="パスワード"
              type="password"
              name="password"
              errors={error?.fieldErrors?.password}
              autoComplete={"new-password"}
            />
          </div>
          <div className="mt-5">
            <Button type="submit" fullWidth>
              {transition.state === "submitting" ? "送信中..." : "登録"}
            </Button>
          </div>
        </fieldset>
      </Form>
    </div>
  );
};
