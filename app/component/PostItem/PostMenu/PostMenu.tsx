import { Menu } from "@headlessui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MenuContainer } from "~/component/Menu/MenuContainer";
import { MenuItems } from "~/component/Menu/MenuItems";
import type { PostWithOwner } from "~/models/post";
import { PostIconButton } from "../PostIconButton";
import { OthersPostMenuItems } from "./OthersPostMenuItems";
import { OwnPostMenuItems } from "./OwnPostMenuItems";

type Props = { post: PostWithOwner; loggedInUserId?: string };

export const PostMenu: React.VFC<Props> = ({ post, loggedInUserId }) => {
  return (
    <MenuContainer>
      <Menu.Button as={PostIconButton} icon={HiOutlineDotsHorizontal} />

      <MenuItems align="right">
        {post.userId === loggedInUserId ? (
          <OwnPostMenuItems post={post} />
        ) : (
          <OthersPostMenuItems post={post} />
        )}
      </MenuItems>
    </MenuContainer>
  );
};
