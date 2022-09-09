import { useActionData } from "@remix-run/react";
import { useMemo } from "react";
import { ValidatedForm } from "remix-validated-form";
import { createPostFormValidator } from "~/formData/createPostFormData";
import type { action } from "~/routes/api/posts";
import { Button } from "../Button";
import { FormError } from "../FormError";
import { ValidatedFormTextarea } from "../ValidatedFormTextarea";

type Props = { onSuccess?: () => void; replySourceId?: string };

export const PostForm: React.VFC<Props> = ({ onSuccess, replySourceId }) => {
  const actionData = useActionData<typeof action>();

  const formError = useMemo(() => {
    // TODO
    // remix側で正しい型がつかないのでとりあえず無理やりanyにキャストして使う
    if (actionData) {
      return (actionData.repopulateFields as any).formError;
    }
  }, [actionData]);

  const handleSubmit = () => {
    onSuccess?.();
  };

  return (
    <ValidatedForm
      validator={createPostFormValidator}
      action="/api/posts?index"
      method="post"
      resetAfterSubmit
      className="px-3 pt-3 pb-2 flex flex-col"
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
      <ValidatedFormTextarea name="content" minRows={3} isVariable />
      <div className="self-end mt-2">
        <Button type="submit">投稿する</Button>
      </div>
    </ValidatedForm>
  );
};
