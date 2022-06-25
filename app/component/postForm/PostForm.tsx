import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { VariableTextArea } from "../VariableTextArea";

type Props = { action?: string };

export const PostForm: React.VFC<Props> = ({ action }) => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const postFetcher = useFetcher();

  useEffect(() => {
    if (postFetcher.type == "done" && postFetcher.data) {
      formRef.current?.reset();
    }
  }, [postFetcher]);

  return (
    <postFetcher.Form
      ref={formRef}
      action={action}
      method="post"
      className="bg-emerald-400 m-1 p-3 flex flex-col"
    >
      <VariableTextArea
        name="content"
        className="rounded-md px-3 py-2 resize-none"
        minRows={3}
      />
      <button
        type="submit"
        className="mt-3 bg-emerald-300 px-3 py-2 rounded-md self-end font-bold"
      >
        投稿する
      </button>
    </postFetcher.Form>
  );
};
