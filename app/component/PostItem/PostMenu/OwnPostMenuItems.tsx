import { Menu } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import type { SyntheticEvent } from "react";
import React from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import type { Post } from "~/routes/__main/home";

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
            <button
              type="submit"
              className={`flex w-full items-center rounded px-2 py-2  ${
                active ? "bg-emerald-500" : ""
              }`}
              onClick={handleClick}
            >
              <RiDeleteBinLine className="mr-2 h-5 w-5 fill-white" />
              <p className="font-bold text-white">削除</p>
            </button>
          </deletePostFetcher.Form>
        )}
      </Menu.Item>
    </>
  );
};
