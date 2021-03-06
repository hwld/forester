import { Menu } from "@headlessui/react";

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import type { Post } from "~/models/post";
import { PostIconButton } from "../PostIconButton";
import { OthersPostMenuItems } from "./OthersPostMenuItems";
import { OwnPostMenuItems } from "./OwnPostMenuItems";

type Props = { post: Post; loggedInUserId?: string };

export const PostMenuButton: React.VFC<Props> = ({ post, loggedInUserId }) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button as={PostIconButton} icon={HiOutlineDotsHorizontal} />

      <Menu.Items className="absolute right-0 bg-emerald-600 w-56 shadow-lg rounded">
        <div className="px-1 py-1">
          {post.userId === loggedInUserId ? (
            <OwnPostMenuItems post={post} />
          ) : (
            <OthersPostMenuItems post={post} />
          )}
        </div>
      </Menu.Items>
    </Menu>
  );
};
