import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

type Props = { fullWidth?: boolean; fullRounded?: boolean } & Omit<
  ComponentPropsWithoutRef<"button">,
  "className"
>;

export const Button: React.VFC<Props> = ({
  fullWidth = false,
  fullRounded = false,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "flex justify-center min-w-[100px] transition bg-emerald-500 text-white text-center font-bold",
        "focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-emerald-200",
        "hover:bg-emerald-600 disabled:bg-emerald-700",
        fullWidth ? "w-full" : "",
        fullRounded ? "rounded-full px-5 py-2" : "rounded-md px-3 py-2"
      )}
      {...props}
    >
      {children}
    </button>
  );
};
