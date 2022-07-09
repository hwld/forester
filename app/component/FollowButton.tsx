import { useFetcher } from "@remix-run/react";

type Props = { userId: string };
export const FollowButton: React.VFC<Props> = ({ userId }) => {
  const followFetcher = useFetcher();

  return (
    <followFetcher.Form action={`/api/users/${userId}/follow`} method="post">
      <button className="px-4 pb-[2px] h-9 bg-emerald-500 hover:bg-emerald-600 rounded-3xl font-bold flex items-center">
        フォロー
      </button>
    </followFetcher.Form>
  );
};
