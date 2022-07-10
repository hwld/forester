import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MainHeader } from "~/component/MainHeader";
import { UserItem } from "~/component/UserItem";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

type Follower = {
  username: string;
  id: string;
  isFollowing: boolean;
  isLoggedInUser: boolean;
};
type UserAndFollower = {
  username: string;
  followers: Follower[];
};
type LoaderData = { user: UserAndFollower };

export const loader: LoaderFunction = async ({ request, params }) => {
  const username = params.username;
  const loggedInUser = await getUser(request);

  const rowUser = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      followedBy: {
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

  const followers: Follower[] = rowUser.followedBy.map((follower) => {
    const isFollowing =
      loggedInUser?.following.some((following) => {
        return following.id === follower.id;
      }) ?? false;

    return {
      username: follower.username,
      id: follower.id,
      isFollowing,
      isLoggedInUser: loggedInUser?.id === follower.id,
    };
  });

  const userAndFollower: UserAndFollower = {
    username: rowUser.username,
    followers,
  };

  return json<LoaderData>({ user: userAndFollower });
};

export default function Followers() {
  const { user } = useLoaderData<LoaderData>();
  return (
    <>
      <MainHeader title={user.username ?? ""} canBack />
      <div className="m-3 font-bold text-white text-xl">フォロワー</div>
      {user.followers.map((follower) => {
        return (
          <div key={follower.username} className="m-3">
            <UserItem
              username={follower.username}
              id={follower.id}
              isOwner={follower.isLoggedInUser}
              isFollowing={follower.isFollowing}
            />
          </div>
        );
      })}
    </>
  );
}
