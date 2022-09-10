import { useActionData } from "@remix-run/react";
import { ValidatedForm } from "remix-validated-form";
import { createPostFormValidator } from "~/formData/createPostFormData";
import type { action } from "~/routes/api/posts";
import { Button } from "../Button";
import { FormError } from "../FormError";
import { ValidatedFormTextarea } from "../ValidatedFormTextarea";

type Props = {
  onSuccess?: () => void;
  replySourceId?: string;
} & (
  | { isVariableTextarea: true; minRows?: number }
  | { isVariableTextarea?: false; rows?: number }
);

export const PostForm: React.VFC<Props> = ({
  onSuccess,
  replySourceId,
  ...props
}) => {
  const actionData = useActionData<typeof action>();

  const formError = actionData?.formError;

  const handleSubmit = () => {
    onSuccess?.();
  };

  return (
    <ValidatedForm
      validator={createPostFormValidator}
      action="/api/posts?index"
      method="post"
      resetAfterSubmit
      className="flex flex-col"
      onSubmit={handleSubmit}
    >
      {replySourceId && (
        <input hidden name="replySourceId" defaultValue={replySourceId} />
      )}
      {formError && (
        <div className="mb-2">
          <FormError message={formError} />
        </div>
      )}
      <ValidatedFormTextarea
        name="content"
        {...(props.isVariableTextarea
          ? { isVariable: true, minRows: props.minRows }
          : { isVariable: false, rows: props.rows, canResize: false })}
      />
      <div className="self-end mt-2">
        <Button type="submit">投稿する</Button>
      </div>
    </ValidatedForm>
  );
};
