import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import type { User } from "~/models/user";
import { Icon } from "../Icon";
import { UserIcon } from "../UserIcon";

type Props = { user: User } & ComponentPropsWithoutRef<"button">;

export const AccountMenuButton = forwardRef<HTMLButtonElement, Props>(
  function AccountMenuButton({ user, ...props }, ref) {
    return (
      <button
        ref={ref}
        className="transition hover:bg-emerald-400/25 p-3 space-x-2 rounded-full flex items-center w-full h-full"
        {...props}
      >
        <UserIcon src={user.iconUrl} />
        <div className="hidden lg:flex grow justify-between items-center h-full">
          <p className="font-bold text-lg self-start">{user.username}</p>
          <Icon icon={HiDotsHorizontal} />
        </div>
      </button>
    );
  }
);
