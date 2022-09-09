import type { ComponentProps } from "react";
import { formatDate } from "~/lib/date";
import type { PostWithOwner } from "~/models/post";
import type { User } from "~/models/user";
import { LikePostButton } from "../LikePostButton";
import { ReplyFormDialogButton } from "../OpenReplyFormDialogButton";
import { UserIconLink } from "../UserIconLink";
import { PostMenu } from "./PostMenu/PostMenu";

type Props = {
  user: User;
  post: PostWithOwner;
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

          <PostMenu post={post} loggedInUserId={user.id} />
        </div>

        <div>
          {post.replySourceUsername && (
            <div className="text-sm text-gray-600">
              Replying to: {post.replySourceUsername}
            </div>
          )}
          <p className="whitespace-pre-line break-all">{post.content}</p>
        </div>
        <ul className="flex items-center space-x-1">
          <li className="flex items-center">
            <ReplyFormDialogButton replySourceId={post.id} user={user} />
            <p className="w-5 text-sm">
              {post.replyPostCount > 0 ? post.replyPostCount : ""}
            </p>
          </li>
          <li className="flex items-center">
            <LikePostButton post={post} />
            <p className="w-5 text-sm">
              {post.likesCount > 0 ? post.likesCount : ""}
            </p>
          </li>
        </ul>
      </div>
    </li>
  );
};
