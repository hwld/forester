import { Menu } from "@headlessui/react";
import type { User } from "~/models/user";
import { AccountMenuButton } from "./AccountMenuButton";
import { MenuContainer } from "../Menu/MenuContainer";
import { MenuItem } from "../Menu/MenuItem";
import { MenuItems } from "../Menu/MenuItems";

type Props = { user: User };
export const AccountMenu: React.VFC<Props> = ({ user }) => {
  return (
    <MenuContainer>
      <Menu.Button as={AccountMenuButton} user={user} />

      <MenuItems position="top" align="left">
        <Menu.Item>
          {({ active }) => (
            <form action="/logout" method="post">
              <MenuItem active={active} type="submit">
                <p className="font-bold">ログアウト</p>
              </MenuItem>
            </form>
          )}
        </Menu.Item>
      </MenuItems>
    </MenuContainer>
  );
};
