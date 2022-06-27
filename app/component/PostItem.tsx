import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiChat1Line } from "react-icons/ri";
import type { Post } from "~/routes/__main/home";

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
          <p className="font-bold">{post.user.username}</p>
          <div className="relative flex justify-center items-center group">
            <div className="absolute bg-transparent group-hover:bg-emerald-500/20 w-8 h-8 rounded-full"></div>
            <HiOutlineDotsHorizontal className="w-5 h-5 transition" />
          </div>
        </div>

        <p className="whitespace-pre-line">{post.content}</p>
        <div className="flex space-x-5">
          <div className="relative flex justify-center items-center group">
            <div className="absolute bg-transparent group-hover:bg-emerald-500/20 w-8 h-8 rounded-full"></div>
            <RiChat1Line className="w-5 h-5 transition" />
          </div>
        </div>
      </div>
    </li>
  );
};
