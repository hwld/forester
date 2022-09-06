import { useEffect, useMemo, useRef } from "react";
import { usePostFetcher } from "~/routes/api/posts";
import { Button } from "../Button";
import { FormControl } from "../FormControl";
import { FormError } from "../FormError";

type Props = { onSuccess?: () => void; replySourceId?: string };

export const PostForm: React.VFC<Props> = ({ onSuccess, replySourceId }) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const postFetcher = usePostFetcher();

  const error = useMemo(() => {
    if (postFetcher.data?.type === "error") {
      return postFetcher.data.error;
    }
  }, [postFetcher]);

  useEffect(() => {
    if (postFetcher.type == "done" && postFetcher.data?.type === "ok") {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [onSuccess, postFetcher]);

  return (
    <postFetcher.Form
      ref={formRef}
      action="/api/posts?index"
      method="post"
      className="px-3 pt-3 pb-2 flex flex-col"
    >
      {replySourceId && (
        <input hidden name="replySourceId" defaultValue={replySourceId} />
      )}
      {error?.formError && (
        <div className="mb-2">
          <FormError message={error.formError} />
        </div>
      )}
      <FormControl
        name="content"
        controlType="variable-textarea"
        minRows={3}
        errors={error?.fieldErrors?.content}
      />
      <div className="self-end mt-2">
        <Button type="submit">投稿する</Button>
      </div>
    </postFetcher.Form>
  );
};
