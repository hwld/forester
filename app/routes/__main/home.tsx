import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { MainHeader } from "~/component/MainHeader";
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
  replyPostCount: number;
  /** リプライ元のユーザー名 */
  replyingTo?: string;
  isOwner: boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const loggedInUser = await requireUser(request);

  const rowPosts = await db.post.findMany({
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { username: true, id: true } },
      replySourcePost: { select: { user: { select: { username: true } } } },
      _count: { select: { replyPosts: true } },
    },
    where: { userId: loggedInUser.id },
    orderBy: { createdAt: "desc" },
  });

  const posts: Post[] = rowPosts.map((row) => ({
    id: row.id,
    content: row.content,
    username: row.user.username,
    createdAt: row.createdAt.toUTCString(),
    replyPostCount: row._count.replyPosts,
    replyingTo: row.replySourcePost?.user.username,
    isOwner: row.user.id === loggedInUser.id,
  }));

  return json<LoaderData>({ posts });
};

export default function Home() {
  const { posts } = useLoaderData<LoaderData>();
  const navigator = useNavigate();

  const handleClickPostItem = (postId: string) => {
    navigator(`/posts/${postId}`);
  };

  return (
    <>
      <MainHeader title="ホーム" />
      <div className="bg-emerald-400">
        <PostForm />
      </div>
      <ul>
        {posts.map((post) => {
          return (
            <div key={post.id} className="m-2">
              <PostItem onClick={handleClickPostItem} post={post} />
            </div>
          );
        })}
      </ul>
    </>
  );
}
