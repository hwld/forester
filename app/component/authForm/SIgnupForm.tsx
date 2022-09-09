import { useTransition } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { authFormValidator } from "~/formData/authFormData";
import { useSignupActionData } from "~/routes/__auth/signup";
import { Button } from "../Button";
import { FormError } from "../FormError";
import { ValidatedFormInput } from "../ValidatedFormInput";
import { AuthFormHeader } from "./AuthFormHeader";

type Props = {};

export const SignupForm: React.VFC<Props> = () => {
  const actionData = useSignupActionData();
  const transition = useTransition();

  const formError = actionData?.formError;

  return (
    <div>
      <AuthFormHeader type={"signup"} />
      <ValidatedForm
        validator={authFormValidator}
        action={"/signup"}
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
              autoComplete="new-password"
              type="password"
            />
          </div>
          <div className="mt-5">
            <Button type="submit" fullWidth>
              {transition.state === "submitting" ? "送信中..." : "登録"}
            </Button>
          </div>
        </fieldset>
      </ValidatedForm>
    </div>
  );
};
