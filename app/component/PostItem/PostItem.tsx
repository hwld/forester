import { Menu } from "@headlessui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiChat1Line, RiDeleteBinLine } from "react-icons/ri";
import type { Post } from "~/routes/__main/home";
import { formatDate } from "~/utils/date";
import { PostItemIconButton } from "./PostItemIconButton";

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

          <Menu as="div" className="relative">
            <Menu.Button
              as={PostItemIconButton}
              icon={HiOutlineDotsHorizontal}
            />

            <Menu.Items className="absolute right-0 bg-emerald-100 w-56 shadow rounded">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`flex w-full items-center rounded px-2 py-2  ${
                        active ? "bg-emerald-300" : ""
                      }`}
                      onClick={handleClickDelete}
                    >
                      <RiDeleteBinLine className="mr-2 h-5 w-5" />
                      <p className="font-bold">削除</p>
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Menu>
        </div>

        <p className="whitespace-pre-line">{post.content}</p>
        <div className="flex space-x-5">
          <PostItemIconButton icon={RiChat1Line} />
        </div>
      </div>
    </li>
  );
};
