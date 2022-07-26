import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { SideMenu } from "~/component/SideMenu";
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

  return (
    <div className="bg-slate-200 flex">
      <div className="grid grid-cols-[75px_600px] lg:grid-cols-[300px_600px] xl:grid-cols-[300px_600px_300px] gap-3 mx-auto">
        {/* メニューカラム */}
        <SideMenu username={username} />

        {/* メインカラム */}
        <div className="border-t border-x border-emerald-500">
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
