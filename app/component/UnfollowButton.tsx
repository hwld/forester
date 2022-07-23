import { useFetcher } from "@remix-run/react";
import { Button } from "./Button";

type Props = { userId: string };
export const UnfollowButton: React.VFC<Props> = ({ userId }) => {
  const unfollowFetcher = useFetcher();

  return (
    <unfollowFetcher.Form
      action={`/api/users/${userId}/unfollow`}
      method="post"
    >
      <Button fullRounded>フォロー解除</Button>
    </unfollowFetcher.Form>
  );
};
