import { Menu } from "@headlessui/react";
import clsx from "clsx";
import type { User } from "~/models/user";
import { AccountMenuButton } from "./AccountMenuButton";

type Props = { user: User };
export const AccountMenu: React.VFC<Props> = ({ user }) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button as={AccountMenuButton} user={user} />

      <Menu.Items className="absolute mb-2 left-0 bottom-full bg-emerald-400 w-56 shadow-lg rounded">
        <div className="p-1">
          <Menu.Item>
            {({ active }) => (
              <form action="/logout" method="post">
                <button
                  type="submit"
                  className={clsx(
                    "flex w-full items-center rounded p-2",
                    active ? "bg-emerald-500" : ""
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="font-bold">ログアウト</p>
                </button>
              </form>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
};
