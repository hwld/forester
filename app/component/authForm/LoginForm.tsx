import { Form, useTransition } from "@remix-run/react";
import { useMemo } from "react";
import { useLoginActionData } from "~/routes/__auth/login";
import { Button } from "../Button";
import { FormControl } from "../FormControl";
import { FormError } from "../FormError";
import { AuthFormHeader } from "./AuthFormHeader";

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
          {error?.formError && <FormError message={error.formError} />}
          <div className="mt-5 space-y-4">
            <FormControl
              controlType="input"
              label="ユーザー名"
              type="text"
              name="username"
              defaultValue={error?.fields?.username}
              errors={error?.fieldErrors?.username}
              autoComplete="username"
            />
            <FormControl
              controlType="input"
              label="パスワード"
              type="password"
              name="password"
              errors={error?.fieldErrors?.password}
              autoComplete={"current-password"}
            />
          </div>
          <div className="mt-5">
            <Button type="submit" fullWidth>
              {transition.state === "submitting" ? "送信中..." : "ログイン"}
            </Button>
          </div>
        </fieldset>
      </Form>
    </div>
  );
};
