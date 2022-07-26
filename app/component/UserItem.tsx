import type { User } from "~/models/user";
import { FollowButton } from "./FollowButton";
import { UnfollowButton } from "./UnfollowButton";
import { UserIconLink } from "./UserIconLink";

type Props = {
  user: User;
  isOwner: boolean;
  isFollowing: boolean;
};
export const UserItem: React.VFC<Props> = ({ user, isFollowing, isOwner }) => {
  return (
    <div className="flex px-3 py-2 rounded space-x-2 border-b border-emerald-500">
      <div className="shrink-0">
        <UserIconLink username={user.username} src={user.iconUrl} />
      </div>
      <div className="w-full">
        <div className="flex justify-between">
          <p className="text-lg font-bold">{user.username}</p>
          {isFollowing ? (
            <UnfollowButton userId={user.id} />
          ) : isOwner ? null : (
            <FollowButton userId={user.id} />
          )}
        </div>
        <div className="text-sm whitespace-pre-line break-all">
          {user.profile}
        </div>
      </div>
    </div>
  );
};
