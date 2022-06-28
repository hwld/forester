import type { ComponentProps } from "react";
import { forwardRef } from "react";
import type { IconType } from "react-icons";

type Props = { icon: IconType } & ComponentProps<"button">;

export const PostItemIconButton = forwardRef<HTMLButtonElement, Props>(
  function PostItemIconButton({ icon, ...buttonProps }, ref) {
    const Icon = icon;

    return (
      <button {...buttonProps} ref={ref}>
        <div className="relative flex justify-center items-center group">
          <div className="absolute bg-transparent group-hover:bg-emerald-500/20 w-8 h-8 rounded-full"></div>
          <Icon className="w-5 h-5" />
        </div>
      </button>
    );
  }
);
