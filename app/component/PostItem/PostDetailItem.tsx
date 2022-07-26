import type { PostWithOwner } from "~/models/post";
import type { User } from "~/models/user";
import { formatDateDetail } from "~/utils/date";
import { ReplyFormDialogButton } from "../OpenReplyFormDialogButton";
import { UserIconLink } from "../UserIconLink";
import { PostMenuButton } from "./PostMenu/PostMenuButton";

type Props = { user: User; post: PostWithOwner; loggedInUserId?: string };

export const PostDetailItem: React.VFC<Props> = ({
  user,
  post,
  loggedInUserId,
}) => {
  return (
    <li className="p-3 border-y border-emerald-500 break-words flex flex-col transition">
      <div className="flex justify-between">
        <div className="flex space-x-3 items-center">
          <UserIconLink username={post.username} src={post.userIconUrl} />
          <p className="font-bold">{post.username}</p>
        </div>

        <PostMenuButton post={post} loggedInUserId={loggedInUserId} />
      </div>
      <div className="ml-2 flex flex-col flex-grow space-y-3">
        <div className="mt-2">
          {post.replySourceUsername && (
            <div className="text-sm text-gray-500">
              Replying to: {post.replySourceUsername}
            </div>
          )}
          <p className="whitespace-pre-line break-all">{post.content}</p>
        </div>

        <p className="text-gray-500">{formatDateDetail(post.createdAt)}</p>

        <div className="w-full h-[1px] bg-emerald-500"></div>
        <div className="h-5 flex items-center">
          <p>0件のいいね</p>
        </div>
        <div className="w-full h-[1px] bg-emerald-500"></div>
        <div className="flex space-x-5">
          <ReplyFormDialogButton
            replySourceId={post.id}
            size="lg"
            user={user}
          />
        </div>
      </div>
    </li>
  );
};
