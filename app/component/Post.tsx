import type { Post } from "@prisma/client";

type Props = { post: Post; onDeletePost: (id: string) => void };

export const PostItem: React.VFC<Props> = ({ post, onDeletePost }) => {
  const handleClickDelete = () => {
    onDeletePost(post.id);
  };

  return (
    <li
      key={post.id}
      className="p-3 m-1 bg-emerald-200 break-words flex flex-col rounded"
    >
      <p className="whitespace-pre-line">{post.content}</p>

      <button
        type="submit"
        className="px-3 py-1 rounded-md bg-red-500 text-white self-end"
        onClick={handleClickDelete}
      >
        削除
      </button>
    </li>
  );
};
