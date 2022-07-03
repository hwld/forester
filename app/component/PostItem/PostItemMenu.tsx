import { Menu } from "@headlessui/react";
import type { SyntheticEvent } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { PostItemIconButton } from "./PostItemIconButton";

type Props = { onDeletePost: () => void };

export const PostItemMenuButton: React.VFC<Props> = ({ onDeletePost }) => {
  const handleClickDelete = (e: SyntheticEvent) => {
    e.stopPropagation();
    onDeletePost();
  };

  return (
    <Menu as="div" className="relative">
      <Menu.Button as={PostItemIconButton} icon={HiOutlineDotsHorizontal} />

      <Menu.Items className="absolute right-0 bg-emerald-600 w-56 shadow-lg rounded">
        <div className="px-1 py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`flex w-full items-center rounded px-2 py-2  ${
                  active ? "bg-emerald-500" : ""
                }`}
                onClick={handleClickDelete}
              >
                <RiDeleteBinLine className="mr-2 h-5 w-5 fill-white" />
                <p className="font-bold text-white">削除</p>
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};
