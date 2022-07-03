import { useNavigate } from "@remix-run/react";
import type { Post } from "~/routes/__main/home";
import { formatDate } from "~/utils/date";
import { ReplyFormDialogButton } from "../OpenReplyFormDialogButton";
import { PostItemMenuButton } from "./PostItemMenu";

type Props = { post: Post; onDeletePost?: (id: string) => void };

// TODO: 自分の投稿と他人の投稿を分ける
export const PostItem: React.VFC<Props> = ({ post, onDeletePost }) => {
  const navigator = useNavigate();

  const handleClickItem = () => {
    navigator(`/posts/${post.id}`);
  };

  const handleClickDelete = () => {
    onDeletePost?.(post.id);
  };

  return (
    <li
      className="p-3 bg-emerald-200 break-words flex rounded hover:bg-opacity-90 transition cursor-pointer"
      onClick={handleClickItem}
    >
      <div>
        <div className="w-12 h-12 rounded-full bg-emerald-500"></div>
      </div>
      <div className="ml-2 flex flex-col flex-grow space-y-2">
        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <p className="font-bold">{post.username}</p>
            <p className="text-sm text-gray-600">
              {formatDate(post.createdAt)}
            </p>
          </div>

          <PostItemMenuButton onDeletePost={handleClickDelete} />
        </div>

        <div>
          {post.replyingTo && (
            <div className="text-sm text-gray-600">
              Replying to: {post.replyingTo}
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
