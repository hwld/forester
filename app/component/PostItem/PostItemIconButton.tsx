import type { ComponentProps } from "react";
import { forwardRef } from "react";
import type { IconType } from "react-icons";

type Props = { icon: IconType; size?: "md" | "lg" } & ComponentProps<"button">;

export const PostItemIconButton = forwardRef<HTMLButtonElement, Props>(
  function PostItemIconButton(
    { icon, size = "md", onClick, ...buttonProps },
    ref
  ) {
    const iconClass = { md: "w-5 h-5", lg: "w-7 h-7" };
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
          <Icon className={iconClass[size]} />
        </div>
      </button>
    );
  }
);
