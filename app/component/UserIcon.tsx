import type { ComponentProps } from "react";
import { useMemo } from "react";

type Props = { size?: "md" | "lg" } & ComponentProps<"div">;

export const UserIcon: React.VFC<Props> = ({ size = "md", ...props }) => {
  const interactiveClass = "hover:bg-emerald-600 transition ";
  const sizeClass = useMemo(() => {
    if (size === "md") {
      return "w-12 h-12";
    } else if (size === "lg") {
      return "w-24 h-24";
    }
    return "w-12 h-12";
  }, [size]);

  return (
    <div
      className={`rounded-full bg-emerald-500 ${sizeClass} ${
        props.onClick ? interactiveClass : ""
      }`}
      {...props}
    />
  );
};
