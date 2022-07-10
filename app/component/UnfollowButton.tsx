import { useFetcher } from "@remix-run/react";

type Props = { userId: string };
export const UnfollowButton: React.VFC<Props> = ({ userId }) => {
  const unfollowFetcher = useFetcher();

  return (
    <unfollowFetcher.Form
      action={`/api/users/${userId}/unfollow`}
      method="post"
    >
      <button className="px-4 pb-[2px] h-9 bg-emerald-500 hover:bg-emerald-600 rounded-3xl font-bold flex items-center text-white">
        フォロー解除
      </button>
    </unfollowFetcher.Form>
  );
};
