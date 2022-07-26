import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { MainHeader } from "~/component/MainHeader";
import { UserItem } from "~/component/UserItem";
import type { UserAndFollowings } from "~/models/user";
import { findUser, findUsers } from "~/models/user";
import { getUser } from "~/utils/session.server";

type LoaderData = {
  userAndFollowing: UserAndFollowings;
  loggedInUserId?: string;
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const username = params.username;
  const loggedInUser = await getUser(request);

  const user = await findUser({ where: { username } });
  if (!user) {
    throw new Error("user not found");
  }

  const followings = await findUsers({
    where: { followedBy: { some: { id: user.id } } },
    loggedInUserId: loggedInUser?.id,
  });

  return json<LoaderData>({
    userAndFollowing: { user, followings },
    loggedInUserId: loggedInUser?.id,
  });
};

export default function Followings() {
  const {
    userAndFollowing: { user, followings },
    loggedInUserId,
  } = useLoaderData<typeof loader>();
  return (
    <>
      <MainHeader title={user.username ?? ""} canBack />
      <div className="p-3 font-bold text-xl border-b border-emerald-500">
        フォロー中
      </div>
      {followings.map((following) => {
        return (
          <UserItem
            key={following.username}
            username={following.username}
            iconUrl={following.iconUrl}
            id={following.id}
            isOwner={following.id === loggedInUserId}
            isFollowing={following.followedByLoggedInUser ?? false}
          />
        );
      })}
    </>
  );
}
