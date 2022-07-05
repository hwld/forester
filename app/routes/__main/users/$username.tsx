import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { MdError } from "react-icons/md";
import { MainHeader } from "~/component/MainHeader";
import { PostItem } from "~/component/PostItem/PostItem";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import type { Post, User } from "../home";

type LoaderData = {
  posts: Post[];
  user: User;
  loggedInUser?: User;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const username = params.username;
  const loggedInUser = await getUser(request);

  const user = await db.user.findUnique({ where: { username } });
  if (!user) {
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

  return json<LoaderData>({ posts, user, loggedInUser });
};

export default function UserHome() {
  const { posts, user, loggedInUser } = useLoaderData<LoaderData>();
  const navigator = useNavigate();

  const handleClickPostItem = (postId: string) => {
    navigator(`/posts/${postId}`);
  };

  return (
    <>
      <MainHeader title={user.username ?? ""} canBack />
      <div className="h-32 bg-emerald-700" />
      <div className="h-48 bg-emerald-800 flex flex-col px-5 space-y-2 text-white">
        <div className="h-12 w-full flex justify-between items-center">
          <div className="rounded-full bg-emerald-500 w-24 h-24 -mt-12" />
          {user.id === loggedInUser?.id ? (
            <button className="px-4 pb-[2px] h-9 bg-emerald-500 hover:bg-emerald-600 rounded-3xl font-bold flex items-center">
              フォロー
            </button>
          ) : (
            <button className="px-4 pb-[2px] h-9 bg-emerald-500 hover:bg-emerald-600 rounded-3xl font-bold flex items-center">
              プロフィールを編集
            </button>
          )}
        </div>
        <div className="text-2xl font-bold">{user.username}</div>
        <div className="ml-2">自己紹介</div>
      </div>
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
