import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { MdError } from "react-icons/md";
import { MainHeader } from "~/component/MainHeader";
import { PostItem } from "~/component/PostItem/PostItem";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import type { Post } from "../home";

type LoaderData = {
  posts: Post[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const username = params.username;
  const loggedInUser = await getUser(request);

  const userExists = await db.user.findUnique({ where: { username } });
  if (!userExists) {
    throw new Error("user not found");
  }

  const rowPosts = await db.post.findMany({
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { username: true, id: true } },
      replySourcePost: { select: { user: { select: { username: true } } } },
      _count: { select: { replyPosts: true } },
    },
    where: { user: { username } },
    orderBy: { createdAt: "desc" },
  });

  const posts: Post[] = rowPosts.map((row) => ({
    id: row.id,
    content: row.content,
    username: row.user.username,
    createdAt: row.createdAt.toUTCString(),
    replyPostCount: row._count.replyPosts,
    replyingTo: row.replySourcePost?.user.username,
    isOwner: row.user.id === loggedInUser?.id,
  }));

  return json<LoaderData>({ posts });
};

export default function UserHome() {
  const { username } = useParams();
  const { posts } = useLoaderData<LoaderData>();
  const navigator = useNavigate();

  const handleClickPostItem = (postId: string) => {
    navigator(`/posts/${postId}`);
  };

  return (
    <>
      <MainHeader title={username ?? ""} canBack />
      {posts.map((post) => {
        return (
          <div key={post.id} className="m-2">
            <PostItem onClick={handleClickPostItem} post={post} />
          </div>
        );
      })}
    </>
  );
}

export const ErrorBoundary = () => {
  // TODO: 他のエラーの場合もありそうだから、
  // propsとしてerrorを受け取って出し分ける必要がありそう
  return (
    <>
      <MainHeader title="" canBack />
      <li className="m-3 p-3 bg-red-200 flex rounded items-center">
        <MdError className="fill-red-500 w-5 h-5" />
        <p className="ml-2 text-red-800 font-bold">ユーザーが存在しません</p>
      </li>
    </>
  );
};
