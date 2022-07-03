import type { Post } from "~/routes/__main/home";
import { formatDateDetail } from "~/utils/date";
import { ReplyFormDialogButton } from "./OpenReplyFormDialogButton";
import { PostItemMenuButton } from "./PostItem/PostItemMenu";

type Props = { post: Post; onDeletePost?: (id: string) => void };

// TODO: 自分の投稿と他人の投稿を分ける
export const PostDetailItem: React.VFC<Props> = ({ post, onDeletePost }) => {
  const handleClickDelete = () => {
    onDeletePost?.(post.id);
  };

  return (
    <li className="p-3 bg-emerald-100 break-words flex flex-col rounded transition">
      <div className="flex justify-between">
        <div className="flex space-x-3 items-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500"></div>
          <p className="font-bold">{post.username}</p>
        </div>

        <PostItemMenuButton onDeletePost={handleClickDelete} />
      </div>
      <div className="ml-2 flex flex-col flex-grow space-y-3">
        <div className="mt-2">
          {post.replyingTo && (
            <div className="text-sm text-gray-500">
              Replying to: {post.replyingTo}
            </div>
          )}
          <p className="whitespace-pre-line break-all">{post.content}</p>
        </div>

        <p className="text-gray-500">{formatDateDetail(post.createdAt)}</p>

        <div className="w-full h-[2px] bg-emerald-200"></div>
        <div className="h-5 flex items-center">
          <p>0件のいいね</p>
        </div>
        <div className="w-full h-[2px] bg-emerald-200"></div>
        <div className="flex space-x-5">
          <ReplyFormDialogButton replySourceId={post.id} size="lg" />
        </div>
      </div>
    </li>
  );
};
