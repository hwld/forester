import type { LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getUser } from "~/utils/session.server";

type LoaderData = {
  username: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (!user) {
    return redirect("login");
  }

  return json<LoaderData>({ username: user.username });
};

export default function Main() {
  const { username } = useLoaderData<LoaderData>();

  return (
    <div className="bg-slate-200 min-h-screen flex">
      <div className="grid grid-cols-[75px_600px] lg:grid-cols-[300px_600px] xl:grid-cols-[300px_600px_300px] gap-3 mx-auto">
        {/* メニューカラム */}
        <div className="h-screen sticky top-0">
          <div className="h-full px-3 py-2 flex flex-col justify-between items-center lg:items-stretch bg-emerald-500">
            <div>
              <img src="/icon.png" alt="logo" className="w-[50px]" />

              <ul className="space-y-1 mt-3">
                {["🏡", "🧑‍🤝‍🧑", "⚙"].map((icon, i) => {
                  return (
                    <li
                      key={i}
                      className="p-2 bg-emerald-200 text-xl rounded-md flex"
                    >
                      <div>{icon}</div>
                      <div className="hidden lg:block">MenuItem</div>
                    </li>
                  );
                })}
                <li>
                  <button className="bg-emerald-300 px-3 py-2 rounded-md self-end font-bold flex">
                    <div className="">✒</div>
                    <div className="hidden lg:block">投稿する</div>
                  </button>
                </li>
              </ul>
            </div>
            <div className="bg-emerald-300 p-3 rounded-md flex items-center justify-between">
              <div className="flex">
                <div className="">😀</div>
                <div className="hidden lg:block">{username}</div>
              </div>
              <form action="/logout" method="post">
                <button className="duration-200 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-md px-3 py-2 hidden lg:block">
                  ログアウト
                </button>
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