import { RiHome7Line, RiUserLine } from "react-icons/ri";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { OpenPostFormDialogButton } from "./OpenPostFormButton";
import { SideMenuItem } from "./SideMenuItem";

type Props = { username: string };
export const SideMenu: React.VFC<Props> = ({ username }) => {
  return (
    <div className="h-screen sticky top-0">
      <div className="h-full px-3 py-2 flex flex-col justify-between items-center lg:items-stretch bg-emerald-500">
        <div className="flex flex-col items-center lg:items-stretch">
          <img src="/icon.png" alt="logo" className="w-[50px]" />

          <ul className="space-y-1 mt-3">
            <li>
              <SideMenuItem
                icon={<Icon icon={RiHome7Line} />}
                link={"/home"}
                text="ホーム"
              />
            </li>
            <li>
              <SideMenuItem
                icon={<Icon icon={RiUserLine} />}
                link={`/users/${username}`}
                text="ユーザー"
              />
            </li>
            <li>
              <OpenPostFormDialogButton />
            </li>
          </ul>
        </div>
        <div className="bg-emerald-300 p-3 rounded-md flex items-center justify-between">
          <div className="flex">
            <div className="">😀</div>
            <div className="hidden lg:block">{username}</div>
          </div>
          <form action="/logout" method="post">
            <div className="hidden lg:block">
              <Button>ログアウト</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
