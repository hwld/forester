import { useTransition } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { authFormValidator } from "~/formData/authFormData";
import { useLoginActionData } from "~/routes/__auth/login";
import { Button } from "../Button";
import { FormError } from "../FormError";
import { ValidatedFormInput } from "../ValidatedFormInput";
import { AuthFormHeader } from "./AuthFormHeader";

type Props = {};

export const LoginForm: React.VFC<Props> = () => {
  const actionData = useLoginActionData();
  const transition = useTransition();

  const formError = actionData?.formError;

  return (
    <div>
      <AuthFormHeader type={"login"} />
      <ValidatedForm
        validator={authFormValidator}
        action={"/login"}
        method="post"
        className="mt-5 p-5 bg-white shadow-md rounded-md"
      >
        <fieldset disabled={transition.state === "submitting"}>
          {formError && <FormError message={formError} />}
          <div className="mt-5 space-y-4">
            <ValidatedFormInput
              label="ユーザー名"
              name="username"
              autoComplete="username"
            />
            <ValidatedFormInput
              label="パスワード"
              name="password"
              type="password"
              autoComplete="current-password"
            />
          </div>
          <div className="mt-5">
            <Button type="submit" fullWidth>
              {transition.state === "submitting" ? "送信中..." : "ログイン"}
            </Button>
          </div>
        </fieldset>
      </ValidatedForm>
    </div>
  );
};
