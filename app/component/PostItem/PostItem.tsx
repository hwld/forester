import type { ComponentProps } from "react";
import type { Post } from "~/models/post";
import { formatDate } from "~/utils/date";
import { ReplyFormDialogButton } from "../OpenReplyFormDialogButton";
import { UserIcon } from "../UserIcon";
import { PostMenuButton } from "./PostMenu/PostMenuButton";

type Props = {
  post: Post;
  onClick?: (id: string) => void;
} & Omit<ComponentProps<"li">, "onClick">;

export const PostItem: React.VFC<Props> = ({ post, onClick, ...props }) => {
  const handleClick = () => {
    onClick?.(post.id);
  };

  return (
    <li
      className={`p-3 bg-emerald-200 break-words flex rounded transition ${
        onClick ? "hover:bg-opacity-80 cursor-pointer" : ""
      }`}
      onClick={handleClick}
      {...props}
    >
      <div>
        <UserIcon username={post.username} />
      </div>
      <div className="ml-2 flex flex-col flex-grow space-y-2">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <p className="font-bold">{post.username}</p>
            <p className="text-sm text-gray-600">
              {formatDate(post.createdAt)}
            </p>
          </div>

          <PostMenuButton post={post} />
        </div>

        <div>
          {post.replySourceUsername && (
            <div className="text-sm text-gray-600">
              Replying to: {post.replySourceUsername}
            </div>
          )}
          <p className="whitespace-pre-line break-all">{post.content}</p>
        </div>
        <div className="flex space-x-5">
          <ReplyFormDialogButton replySourceId={post.id} />
          {post.replyPostCount > 0 ? post.replyPostCount : ""}
        </div>
      </div>
    </li>
  );
};
