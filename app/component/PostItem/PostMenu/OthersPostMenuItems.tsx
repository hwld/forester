import { Menu } from "@headlessui/react";
import { useFetcher } from "@remix-run/react";
import { MdPersonAddAlt1 } from "react-icons/md";
import type { PostWithOwner } from "~/models/post";

type Props = { post: PostWithOwner };

export const OthersPostMenuItems: React.VFC<Props> = ({ post }) => {
  const isFollowing = post.owner.followedByLoggedInUser;
  const fetcher = useFetcher();

  return (
    <>
      <Menu.Item>
        {({ active }) => (
          <fetcher.Form
            method="post"
            action={
              isFollowing
                ? `/api/users/${post.userId}/unfollow`
                : `/api/users/${post.userId}/follow`
            }
          >
            <button
              type="submit"
              className={`flex w-full items-center rounded px-2 py-2  ${
                active ? "bg-emerald-500" : ""
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <MdPersonAddAlt1 className="mr-2 h-5 w-5" />
              <p className="font-bold break-">
                {isFollowing
                  ? `フォローを解除する`
                  : `${post.username} をフォローする`}
              </p>
            </button>
          </fetcher.Form>
        )}
      </Menu.Item>
    </>
  );
};
