import { useEffect, useMemo, useRef } from "react";
import { MdError } from "react-icons/md";
import { usePostFetcher } from "~/routes/api/posts";
import { VariableTextArea } from "../VariableTextArea";

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
      className="p-3 flex flex-col"
    >
      {replySourceId && (
        <input hidden name="replySourceId" defaultValue={replySourceId} />
      )}
      {error?.formError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <MdError className="fill-red-500 w-5 h-5" />
          <p className="text-red-600">{error?.formError}</p>
        </div>
      )}
      <VariableTextArea
        name="content"
        className={`mt-3 rounded-md px-3 py-2 resize-none ${
          error?.fieldErrors?.content ? "" : ""
        }`}
        minRows={3}
      />
      {error?.fieldErrors?.content && (
        <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md flex items-center">
          <MdError className="fill-red-500 w-5 h-5" />
          <p className="ml-1 text-red-600">{error?.fieldErrors.content}</p>
        </div>
      )}
      <button
        type="submit"
        className="mt-3 bg-emerald-300 px-3 py-1 rounded-md self-end font-bold text-gray-800"
      >
        投稿する
      </button>
    </postFetcher.Form>
  );
};
