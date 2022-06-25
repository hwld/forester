import type { Post } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { PostItem } from "~/component/Post";
import { PostForm } from "~/component/PostForm/PostForm";
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

export default function Home() {
  const { posts } = useLoaderData<LoaderData>();
  const deletePostFetcher = useFetcher();

  const handleDeletePost = (id: string) => {
    deletePostFetcher.submit(null, {
      action: `/posts/${id}?index`,
      method: "delete",
    });
  };

  return (
    <>
      <div className="sticky top-0 h-12 bg-emerald-600 flex justify-between items-center px-4 select-none">
        <p className="font-bold text-xl text-white">ホーム</p>
      </div>
      <PostForm action="/posts?index" />
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
