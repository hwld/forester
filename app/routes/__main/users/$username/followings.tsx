import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MainHeader } from "~/component/MainHeader";
import { UserItem } from "~/component/UserItem";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

type Following = {
  username: string;
  id: string;
  isFollowing: boolean;
  isLoggedInUser: boolean;
};
type UserAndFollowing = {
  username: string;
  followings: Following[];
};
type LoaderData = { user: UserAndFollowing };

export const loader: LoaderFunction = async ({ request, params }) => {
  const username = params.username;
  const loggedInUser = await getUser(request);

  const rowUser = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      following: {
        select: {
          id: true,
          username: true,
          followedBy: { select: { id: true } },
        },
      },
    },
  });
  if (!rowUser) {
    throw new Error("user not found");
  }

  const followings: Following[] = rowUser.following.map((following) => {
    const isFollowing =
      loggedInUser?.following.some(({ id }) => {
        return id === following.id;
      }) ?? false;

    return {
      username: following.username,
      id: following.id,
      isFollowing,
      isLoggedInUser: loggedInUser?.id === following.id,
    };
  });

  const userAndFollowing: UserAndFollowing = {
    username: rowUser.username,
    followings,
  };

  return json<LoaderData>({ user: userAndFollowing });
};

export default function Followings() {
  const { user } = useLoaderData<LoaderData>();
  return (
    <>
      <MainHeader title={user.username ?? ""} canBack />
      <div className="m-3 font-bold text-white text-xl">フォロー中</div>
      {user.followings.map((following) => {
        return (
          <div key={following.username} className="m-3">
            <UserItem
              username={following.username}
              id={following.id}
              isOwner={following.isLoggedInUser}
              isFollowing={following.isFollowing}
            />
          </div>
        );
      })}
    </>
  );
}
