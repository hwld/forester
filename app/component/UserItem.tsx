import { FollowButton } from "./FollowButton";
import { UnfollowButton } from "./UnfollowButton";
import { UserIconLink } from "./UserIconLink";

type Props = {
  username: string;
  iconUrl: string;
  id: string;
  isOwner: boolean;
  isFollowing: boolean;
};
export const UserItem: React.VFC<Props> = ({
  username,
  iconUrl,
  id,
  isFollowing,
  isOwner,
}) => {
  return (
    <div className="flex bg-emerald-300 px-3 py-2 rounded space-x-2">
      <div className="shrink-0">
        <UserIconLink username={username} src={iconUrl} />
      </div>
      <div className="w-full">
        <div className="flex justify-between">
          <p className="text-lg font-bold">{username}</p>
          {isFollowing ? (
            <UnfollowButton userId={id} />
          ) : isOwner ? null : (
            <FollowButton userId={id} />
          )}
        </div>
        <div className="text-sm">自己紹介</div>
      </div>
    </div>
  );
};
