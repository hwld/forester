import { Link } from "@remix-run/react";
import clsx from "clsx";
import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  text: string;
  link: string;
  currentPath: string;
};

export const SideMenuItem: React.VFC<Props> = ({
  icon,
  text,
  link,
  currentPath,
}) => {
  const isActive = link === currentPath;

  return (
    <Link
      to={link}
      className={clsx(
        "flex items-center justify-center w-10 h-10 space-x-0 px-3 py-1 transition hover:bg-orange-400/25 rounded-full",
        "lg:w-auto lg:space-x-2 lg:p-3 lg:justify-start",
        isActive ? "text-orange-500 font-bold" : "bg-transparent"
      )}
    >
      <div>{icon}</div>
      <div className="hidden lg:block text-lg">{text}</div>
    </Link>
  );
};
