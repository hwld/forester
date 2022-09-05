import { Menu } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import type { SyntheticEvent } from "react";
import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { MenuItem } from "~/component/Menu/MenuItem";
import type { Post } from "~/models/post";

type Props = { post: Post };

export const OwnPostMenuItems: React.VFC<Props> = ({ post }) => {
  const deletePostFetcher = useFetcher();

  const handleClick = (e: SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <Menu.Item>
        {({ active }) => (
          <deletePostFetcher.Form
            method="delete"
            action={`/api/posts/${post.id}?index`}
          >
            <MenuItem active={active}>
              <RiDeleteBinLine className="mr-2 h-5 w-5 " />
              <p className="font-bold">削除</p>
            </MenuItem>
          </deletePostFetcher.Form>
        )}
      </Menu.Item>
    </>
  );
};
