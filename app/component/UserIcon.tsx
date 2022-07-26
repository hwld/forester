import type { ComponentProps } from "react";
import { useMemo } from "react";

type Props = { size?: "md" | "lg" } & ComponentProps<"img">;

export const UserIcon: React.VFC<Props> = ({ size = "md", ...props }) => {
  const interactiveClass = "hover:bg-emerald-600 transition cursor-pointer";
  const sizeClass = useMemo(() => {
    if (size === "md") {
      return "w-12 h-12";
    } else if (size === "lg") {
      return "w-24 h-24";
    }
    return "w-12 h-12";
  }, [size]);

  return (
    <img
      alt="user"
      className={`rounded-full bg-slate-400 shrink-0 ${sizeClass} ${
        props.onClick ? interactiveClass : ""
      }`}
      {...props}
    />
  );
};
