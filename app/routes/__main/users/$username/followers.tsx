import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MainHeader } from "~/component/MainHeader";
import { UserItem } from "~/component/UserItem";
import type { UserAndFollowers } from "~/models/user";
import { findUser, findUsers } from "~/models/user";
import { getUser } from "~/utils/session.server";

type LoaderData = {
  userAndFollowers: UserAndFollowers;
  loggedInUserId?: string;
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const username = params.username;
  const loggedInUser = await getUser(request);

  const user = await findUser({ where: { username } });
  if (!user) {
    throw new Error("user not found");
  }

  const followers = await findUsers({
    where: { following: { some: { id: user.id } } },
    loggedInUserId: loggedInUser?.id,
  });

  return json<LoaderData>({
    userAndFollowers: { user, followers },
    loggedInUserId: loggedInUser?.id,
  });
};

export default function Followers() {
  const {
    userAndFollowers: { user, followers },
    loggedInUserId,
  } = useLoaderData<typeof loader>();
  return (
    <>
      <MainHeader title={user.username ?? ""} canBack />
      <div className="m-3 font-bold text-white text-xl">フォロワー</div>
      {followers.map((follower) => {
        return (
          <div key={follower.username} className="m-3">
            <UserItem
              username={follower.username}
              iconUrl={follower.iconUrl}
              id={follower.id}
              isOwner={follower.id === loggedInUserId}
              isFollowing={follower.followedByLoggedInUser ?? false}
            />
          </div>
        );
      })}
    </>
  );
}
