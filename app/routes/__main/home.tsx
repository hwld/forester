import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getUser } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const user = getUser(request);
  if (!user) {
    return redirect("login");
  }
};

export default function Home() {
  return (
    <>
      {/* ヘッダ */}
      <div className="sticky top-0 h-12 bg-emerald-600 flex justify-between items-center px-4 select-none">
        <p className="font-bold text-xl text-white">ホーム</p>
      </div>
      {/* 投稿フォーム */}
      <div className="bg-emerald-400 h-[150px] m-1 p-3 flex flex-col justify-between">
        <input className="rounded-md px-3 py-2" />
        <button className="bg-emerald-300 px-3 py-2 rounded-md self-end font-bold">
          投稿する
        </button>
      </div>
      {/* タイムライン*/}
      <ul>
        {[...new Array(0)].map((_, i) => {
          return (
            <li key={i} className="p-3 m-1 bg-emerald-200 break-words">
              <p>
                Lorem ipsum dolor sit amet amet sit clita. Sadipscing diam lorem
                amet dolores lorem est erat amet enim. No vero ex invidunt
                consetetur eos clita elitr sadipscing et lobortis et exerci
                sanctus et gubergren. Sea ut sed at vero vel sit praesent id
                adipiscing sadipscing sea kasd stet ea nulla. Kasd suscipit enim
                diam dolore in eirmod ut duo erat nonumy eirmod. Dolores
                facilisi consetetur ut dolor amet vero sit dolore eos facilisi
                erat duo takimata justo labore. Molestie dolor elitr voluptua
                sit nonumy veniam exerci eos at invidunt labore est vero
                takimata. Duo et aliquam stet dolor accumsan justo dolor nonumy
                voluptua et.
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
}
