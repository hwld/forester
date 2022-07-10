import { useNavigate } from "@remix-run/react";
import type { SyntheticEvent } from "react";

type Props = { username: string };

export const UserIcon: React.VFC<Props> = ({ username }) => {
  const navigator = useNavigate();

  const handleClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    navigator(`/users/${username}`);
  };

  return (
    <div
      className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 transition"
      onClick={handleClick}
    />
  );
};
