import clsx from "clsx";
import type { ComponentPropsWithRef, ReactNode } from "react";

type Props = {
  children: ReactNode;
  active: boolean;
} & Omit<ComponentPropsWithRef<"button">, "className">;
export const MenuItem: React.VFC<Props> = ({
  children,
  active,
  onClick,
  ...props
}) => {
  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <button
      className={clsx(
        "flex w-full items-center rounded p-2",
        active ? "bg-black/5" : ""
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
