import clsx from "clsx";
import type { ComponentProps } from "react";
import { forwardRef } from "react";
import type { IconType } from "react-icons";

type Props = {
  icon: IconType;
  iconClass?: string;
  size?: "md" | "lg";
} & ComponentProps<"button">;

export const PostIconButton = forwardRef<HTMLButtonElement, Props>(
  function PostItemIconButton(
    { icon, iconClass, size = "md", onClick, ...buttonProps },
    ref
  ) {
    const innerIconClass = {
      md: clsx("w-5 h-5", iconClass),
      lg: clsx("w-7 h-7", iconClass),
    };
    const dropBaseClass =
      "absolute bg-transparent group-hover:bg-emerald-500/20 rounded-full";
    const dropClass = {
      md: `${dropBaseClass} w-8 h-8`,
      lg: `${dropBaseClass} w-10 h-10`,
    };

    const Icon = icon;

    const handleClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      e.stopPropagation();
      onClick?.(e);
    };

    return (
      <button onClick={handleClick} {...buttonProps} ref={ref}>
        <div className="relative flex justify-center items-center group">
          <div className={dropClass[size]}></div>
          <Icon className={innerIconClass[size]} />
        </div>
      </button>
    );
  }
);
