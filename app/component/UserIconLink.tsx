import { useNavigate } from "@remix-run/react";
import type { ComponentProps, SyntheticEvent } from "react";
import { UserIcon } from "./UserIcon";

type Props = { username: string } & ComponentProps<"img">;

export const UserIconLink: React.VFC<Props> = ({ username, ...props }) => {
  const navigator = useNavigate();

  const handleClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    navigator(`/users/${username}`);
  };

  return <UserIcon onClick={handleClick} {...props} />;
};
