import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";
import { buttonBaseClass } from "~/consts/buttonBaseClass";

export type ButtonProps = {
  fullWidth?: boolean;
  fullRounded?: boolean;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

export const Button: React.VFC<ButtonProps> = ({
  fullWidth = false,
  fullRounded = false,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        buttonBaseClass,
        "font-bold text-black",
        fullWidth ? "w-full" : "min-w-[100px]",
        fullRounded ? "rounded-full px-5 py-2" : "rounded-md px-3 py-2"
      )}
      {...props}
    >
      {children}
    </button>
  );
};
