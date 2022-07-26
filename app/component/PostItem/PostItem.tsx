import type { ComponentProps } from "react";
import type { Post } from "~/models/post";
import type { User } from "~/models/user";
import { formatDate } from "~/utils/date";
import { ReplyFormDialogButton } from "../OpenReplyFormDialogButton";
import { UserIconLink } from "../UserIconLink";
import { PostMenuButton } from "./PostMenu/PostMenuButton";

type Props = {
  user: User;
  post: Post;
  onClick?: (id: string) => void;
} & Omit<ComponentProps<"li">, "onClick">;

export const PostItem: React.VFC<Props> = ({
  user,
  post,
  onClick,
  ...props
}) => {
  const handleClick = () => {
    onClick?.(post.id);
  };

  return (
    <li
      className={`p-3 break-words flex transition border-b border-emerald-500 ${
        onClick ? "hover:bg-black/5 cursor-pointer" : ""
      }`}
      onClick={handleClick}
      {...props}
    >
      <div className="shrink-0">
        <UserIconLink username={post.username} src={post.userIconUrl} />
      </div>
      <div className="ml-2 flex flex-col flex-grow space-y-2">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <p className="font-bold">{post.username}</p>
            <p className="text-sm text-gray-600">
              {formatDate(post.createdAt)}
            </p>
          </div>

          <PostMenuButton post={post} loggedInUserId={user.id} />
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
          <ReplyFormDialogButton replySourceId={post.id} user={user} />
          {post.replyPostCount > 0 ? post.replyPostCount : ""}
        </div>
      </div>
    </li>
  );
};
