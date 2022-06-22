import type { Post } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUser, requireUser } from "~/utils/session.server";

type LoaderData = {
  posts: Post[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const posts = await db.post.findMany({ where: { userId: user.id } });
  return json<LoaderData>({ posts });
};

export const action: ActionFunction = async ({ request }) => {
  const user = getUser(request);
  if (!user) {
    return redirect("login");
  }
};

export default function Home() {
  const { posts } = useLoaderData<LoaderData>();

  return (
    <>
      {/* ヘッダ */}
      <div className="sticky top-0 h-12 bg-emerald-600 flex justify-between items-center px-4 select-none">
        <p className="font-bold text-xl text-white">ホーム</p>
      </div>
      {/* 投稿フォーム */}
      <Form
        action="/posts?index"
        method="post"
        className="bg-emerald-400 h-[150px] m-1 p-3 flex flex-col justify-between"
      >
        <input name="content" className="rounded-md px-3 py-2" />
        <button
          type="submit"
          className="bg-emerald-300 px-3 py-2 rounded-md self-end font-bold"
        >
          投稿する
        </button>
      </Form>
      {/* タイムライン*/}
      <ul>
        {posts.map((post) => {
          return (
            <li key={post.id} className="p-3 m-1 bg-emerald-200 break-words">
              <p>{post.content}</p>
              <Form
                action={`/posts/${post.id}/delete`}
                method="post"
                className="flex justify-end"
                replace
              >
                <button
                  type="submit"
                  className="px-3 py-1 rounded-md bg-red-500 text-white"
                >
                  削除
                </button>
              </Form>
            </li>
          );
        })}
      </ul>
    </>
  );
}
