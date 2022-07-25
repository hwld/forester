import { Link } from "@remix-run/react";
import clsx from "clsx";
import type { ReactNode } from "react";

type Props = { icon: ReactNode; text: string; link: string };

export const SideMenuItem: React.VFC<Props> = ({ icon, text, link }) => {
  return (
    <Link
      to={link}
      className={clsx(
        "flex items-center justify-center w-10 h-10 space-x-0  px-3 py-2 bg-transparent transition hover:bg-white/20 rounded-full",
        "lg:w-auto lg:h-auto lg:space-x-2 lg:p-3 lg:justify-start"
      )}
    >
      <div>{icon}</div>
      <div className="font-bold hidden lg:block">{text}</div>
    </Link>
  );
};
