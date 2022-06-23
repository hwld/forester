import type { Post } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { PostItem } from "~/component/Post";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";

type LoaderData = {
  posts: Post[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const posts = await db.post.findMany({ where: { userId: user.id } });
  return json<LoaderData>({ posts });
};

export const action: ActionFunction = async ({ request }) => {
  await requireUser(request);
};

export default function Home() {
  const { posts } = useLoaderData<LoaderData>();
  const postFetcher = useFetcher();
  const deletePostFetcher = useFetcher();
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleDeletePost = (id: string) => {
    deletePostFetcher.submit(null, {
      action: `/posts/${id}?index`,
      method: "delete",
    });
  };

  useEffect(() => {
    if (postFetcher.type == "done" && postFetcher.data.post) {
      formRef.current?.reset();
    }
  }, [postFetcher]);

  return (
    <>
      {/* ヘッダ */}
      <div className="sticky top-0 h-12 bg-emerald-600 flex justify-between items-center px-4 select-none">
        <p className="font-bold text-xl text-white">ホーム</p>
      </div>
      {/* 投稿フォーム */}
      <postFetcher.Form
        ref={formRef}
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
      </postFetcher.Form>
      {/* タイムライン*/}
      <ul>
        {posts.map((post) => {
          return (
            <PostItem
              key={post.id}
              onDeletePost={handleDeletePost}
              post={post}
            />
          );
        })}
      </ul>
    </>
  );
}
