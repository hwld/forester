import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { PostForm } from "~/component/PostForm/PostForm";
import { PostItem } from "~/component/PostItem/PostItem";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";

type LoaderData = {
  posts: Post[];
};

export type Post = {
  id: string;
  createdAt: string;
  content: string;
  username: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);

  const rowPosts = await db.post.findMany({
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { username: true } },
    },
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  const posts: Post[] = rowPosts.map((row) => ({
    id: row.id,
    content: row.content,
    username: row.user.username,
    createdAt: row.createdAt.toUTCString(),
  }));

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
      <div className="bg-emerald-400">
        <PostForm />
      </div>
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
