import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { Button } from "~/component/Button";
import { IconButton } from "~/component/IconButton";
import { OpenPostFormDialogButton } from "~/component/OpenPostFormButton";
import { requireUser } from "~/utils/session.server";

type LoaderData = {
  username: string;
};
export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);

  return json<LoaderData>({ username: user.username });
};

export default function Main() {
  const { username } = useLoaderData<typeof loader>();

  const menu = [
    ["🏡", "ホーム", "/home"],
    ["🙎", "ユーザー", `/users/${username}`],
    ["⚙", "設定"],
  ];

  return (
    <div className="bg-slate-200 flex">
      <div className="grid grid-cols-[75px_600px] lg:grid-cols-[300px_600px] xl:grid-cols-[300px_600px_300px] gap-3 mx-auto">
        {/* メニューカラム */}
        <div className="h-screen sticky top-0">
          <div className="h-full px-3 py-2 flex flex-col justify-between items-center lg:items-stretch bg-emerald-500">
            <div>
              <img src="/icon.png" alt="logo" className="w-[50px]" />

              <ul className="space-y-1 mt-3">
                {menu.map(([icon, text, link], i) => {
                  return (
                    <li key={i}>
                      <Link to={link ?? "/"}>
                        <IconButton icon={icon} text={text} fullWidth />
                      </Link>
                    </li>
                  );
                })}
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

        {/* メインカラム */}
        <div className="bg-emerald-500">
          <Outlet />
        </div>

        {/* 追加情報カラム */}
        <div className="h-screen hidden xl:block sticky top-0">
          <div className="h-1/3 mt-3 bg-emerald-500 rounded-md"></div>
          <div className="h-1/3 mt-3 bg-emerald-500 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}
