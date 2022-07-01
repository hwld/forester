import { Menu } from "@headlessui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiDeleteBinLine } from "react-icons/ri";
import { PostItemIconButton } from "./PostItemIconButton";

type Props = { onDeletePost: () => void };

export const PostItemMenuButton: React.VFC<Props> = ({ onDeletePost }) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button as={PostItemIconButton} icon={HiOutlineDotsHorizontal} />

      <Menu.Items className="absolute right-0 bg-emerald-100 w-56 shadow rounded">
        <div className="px-1 py-1">
          <Menu.Item>
            {({ active }) => (
              <button
                className={`flex w-full items-center rounded px-2 py-2  ${
                  active ? "bg-emerald-300" : ""
                }`}
                onClick={onDeletePost}
              >
                <RiDeleteBinLine className="mr-2 h-5 w-5" />
                <p className="font-bold">削除</p>
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};
