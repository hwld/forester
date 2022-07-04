import { Menu } from "@headlessui/react";
import { MdPersonAddAlt1 } from "react-icons/md";
import type { Post } from "~/routes/__main/home";

type Props = { post: Post };

export const OthersPostMenuItems: React.VFC<Props> = ({ post }) => {
  return (
    <>
      <Menu.Item>
        {({ active }) => (
          <button
            type="submit"
            className={`flex w-full items-center rounded px-2 py-2  ${
              active ? "bg-emerald-500" : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <MdPersonAddAlt1 className="mr-2 h-5 w-5 fill-white" />
            <p className="font-bold text-white">{`${post.username} をフォローする`}</p>
          </button>
        )}
      </Menu.Item>
    </>
  );
};
