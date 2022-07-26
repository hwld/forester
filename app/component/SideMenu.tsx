import { Link, useLocation } from "@remix-run/react";
import { RiHome7Line, RiUserLine } from "react-icons/ri";
import type { User } from "~/models/user";
import { AccountMenu } from "./AccountMenu";
import { Icon } from "./Icon";
import { OpenPostFormDialogButton } from "./OpenPostFormButton";
import { SideMenuItem } from "./SideMenuItem";

type Props = { user: User };
export const SideMenu: React.VFC<Props> = ({ user }) => {
  const { pathname } = useLocation();

  return (
    <div className="h-screen sticky top-0">
      <div className="h-full px-0 py-2 lg:px-3 flex flex-col justify-between items-center lg:items-stretch ">
        <div className="flex flex-col items-center lg:items-stretch">
          <Link to={"/home"}>
            <img src="/icon.png" alt="logo" className="w-[50px]" />
          </Link>

          <ul className="space-y-1 mt-3">
            <li>
              <SideMenuItem
                icon={<Icon icon={RiHome7Line} />}
                link={"/home"}
                currentPath={pathname}
                text="ホーム"
              />
            </li>
            <li>
              <SideMenuItem
                icon={<Icon icon={RiUserLine} />}
                link={`/users/${user.username}`}
                currentPath={pathname}
                text="ユーザー"
              />
            </li>
            <li>
              <OpenPostFormDialogButton user={user} />
            </li>
          </ul>
        </div>
        <AccountMenu user={user} />
      </div>
    </div>
  );
};
