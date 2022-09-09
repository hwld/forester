import { useFetcher } from "@remix-run/react";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";
import type { Post } from "~/models/post";
import { PostIconButton } from "./PostItem/PostIconButton";

type Props = { post: Post; size?: "md" | "lg" };
export const LikePostButton: React.VFC<Props> = ({ post, size = "md" }) => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form
      method="post"
      action={`/api/posts/${post.id}/like`}
      className="flex items-center"
    >
      {post.likedByLoggedInUser ? (
        <PostIconButton
          icon={RiHeartFill}
          iconClass="fill-emerald-500"
          size={size}
        />
      ) : (
        <PostIconButton icon={RiHeartLine} size={size} />
      )}
    </fetcher.Form>
  );
};
