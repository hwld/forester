import { useNavigate } from "@remix-run/react";
import type { SyntheticEvent } from "react";
import { UserIcon } from "./UserIcon";

type Props = { username: string };

export const UserIconLink: React.VFC<Props> = ({ username }) => {
  const navigator = useNavigate();

  const handleClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    navigator(`/users/${username}`);
  };

  return <UserIcon onClick={handleClick} />;
};
