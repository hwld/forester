import type { Post } from "~/routes/__main/home";
import { formatDate } from "~/utils/date";
import { ReplyFormDialogButton } from "../OpenReplyFormDialogButton";
import { PostItemMenuButton } from "./PostItemMenu";

type Props = { post: Post; onDeletePost: (id: string) => void };

export const PostItem: React.VFC<Props> = ({ post, onDeletePost }) => {
  const handleClickDelete = () => {
    onDeletePost(post.id);
  };

  return (
    <li
      key={post.id}
      className="p-3 m-1 bg-emerald-200 break-words flex rounded"
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

        <p className="whitespace-pre-line">{post.content}</p>
        <div className="flex space-x-5">
          <ReplyFormDialogButton />
        </div>
      </div>
    </li>
  );
};
