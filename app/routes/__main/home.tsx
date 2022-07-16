import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { MainHeader } from "~/component/MainHeader";
import { PostForm } from "~/component/PostForm/PostForm";
import { PostItem } from "~/component/PostItem/PostItem";
import type { Post } from "~/models/post";
import { findPosts } from "~/models/post";
import { requireUser } from "~/utils/session.server";

type LoaderData = {
  posts: Post[];
};

export type User = {
  id: string;
  username: string;
  followedBy: number;
  following: number;
};

export const loader: LoaderFunction = async ({ request }) => {
  const loggedInUser = await requireUser(request);

  const id = loggedInUser.id;
  const posts = await findPosts({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
    loggedInUserId: id,
  });

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
