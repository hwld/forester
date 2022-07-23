import { useFetcher } from "@remix-run/react";
import { Button } from "./Button";

type Props = { userId: string };
export const FollowButton: React.VFC<Props> = ({ userId }) => {
  const followFetcher = useFetcher();

  return (
    <followFetcher.Form action={`/api/users/${userId}/follow`} method="post">
      <div className="items-center">
        <Button fullRounded>フォロー</Button>
      </div>
    </followFetcher.Form>
  );
};
