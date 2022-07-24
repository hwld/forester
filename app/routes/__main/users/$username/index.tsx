import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdError } from "react-icons/md";
import { FollowButton } from "~/component/FollowButton";
import { MainHeader } from "~/component/MainHeader";
import { PostItem } from "~/component/PostItem/PostItem";
import { UnfollowButton } from "~/component/UnfollowButton";
import { UserIcon } from "~/component/UserIcon";
import type { Post } from "~/models/post";
import { findPosts } from "~/models/post";
import type { User } from "~/models/user";
import { findUser } from "~/models/user";
import { getUser } from "~/utils/session.server";

type LoaderData = {
  posts: Post[];
  user: User;
  loggedInUser?: User;
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const username = params.username;
  const loggedInUser = await getUser(request);

  const user = await findUser({ where: { username } });

  if (!user) {
    throw new Error("user not found");
  }

  const posts = await findPosts({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return json<LoaderData>({ posts, user, loggedInUser });
};

export default function UserHome() {
  const { posts, user, loggedInUser } = useLoaderData<typeof loader>();
  const navigator = useNavigate();

  const handleClickPostItem = (postId: string) => {
    navigator(`/posts/${postId}`);
  };

  return (
    <>
      <MainHeader title={user.username ?? ""} canBack />
      <div className="h-32 bg-emerald-700" />
      <div className="bg-emerald-800 flex flex-col px-3 pb-3 space-y-2 text-white">
        <div className="h-12 w-full flex justify-between items-center">
          <div className="-mt-12">
            <UserIcon size="lg" src={user.iconUrl} />
          </div>
          <div className="flex space-x-2">
            <button className="border border-emerald-500 hover:bg-white/20 transition rounded-full w-9 h-9 flex justify-center items-center">
              <HiOutlineDotsHorizontal className="h-full w-3/5" />
            </button>
            {user.id === loggedInUser?.id ? (
              <Link
                to={"/settings/profile"}
                className="px-4 pb-[2px] h-9 bg-emerald-500 hover:bg-emerald-600 rounded-3xl font-bold flex items-center"
              >
                プロフィールを編集
              </Link>
            ) : user.followedByTheLoggedInUser ? (
              <UnfollowButton userId={user.id} />
            ) : (
              <FollowButton userId={user.id} />
            )}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold">{user.username}</div>
          <div className="ml-2">
            <p className="whitespace-pre-line break-all">{user.profile}</p>
          </div>
          <div className="flex space-x-5 text-sm">
            <Link
              to="followings"
              className="hover:underline underline-offset-2"
            >
              <span>{user.followingsCount}</span>
              {/* スペース1つだとlinterが中括弧なしに変換してしまうので、わかりやすくするために2つ入れる */}
              {"  "}
              <span className="text-gray-300">フォロー中</span>
            </Link>
            <Link to="followers" className="hover:underline underline-offset-2">
              <span>{user.followersCount}</span>
              {"  "}
              <span className="text-gray-300">フォロワー</span>
            </Link>
          </div>
        </div>
      </div>
      {posts.map((post) => {
        return (
          <div key={post.id} className="m-2">
            <PostItem
              onClick={handleClickPostItem}
              post={post}
              loggedInUserId={loggedInUser?.id}
            />
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
