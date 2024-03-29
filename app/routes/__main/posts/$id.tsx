import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { MdError } from "react-icons/md";
import { MainHeader } from "~/component/MainHeader";
import { PostDetailItem } from "~/component/PostItem/PostDetailItem";
import { PostItem } from "~/component/PostItem/PostItem";
import type { PostWithOwner } from "~/models/post";
import {
  findPostWithOwner,
  findPostWithOwners,
} from "~/models/post/finder.server";
import type { User } from "~/models/user";
import { Auth } from "~/services/authentication.server";

type PostTreeData = {
  post: PostWithOwner;
  replySourcePost?: PostWithOwner;
  replyPosts: PostWithOwner[];
  loggedInUser: User;
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const loggedInUser = await Auth.requireUser(request);
  const postId = params.id;

  if (!postId) {
    throw new Error("サーバーでエラーが発生しました。");
  }

  const postData = await findPostWithOwner({
    where: { id: postId },
    loggedInUserId: loggedInUser.id,
  });
  if (!postData) {
    throw new Error("投稿が見つかりませんでした。");
  }

  const { post, replySourcePost } = postData;
  const replyPosts = await findPostWithOwners({
    where: { replySourcePostId: postId },
    loggedInUserId: loggedInUser.id,
  });

  return json<PostTreeData>({
    post,
    replySourcePost,
    replyPosts,
    loggedInUser,
  });
};

export default function PostTree() {
  const { post, replySourcePost, replyPosts, loggedInUser } =
    useLoaderData<typeof loader>();
  const navigator = useNavigate();

  const handleClickPostItem = (postId: string) => {
    navigator(`/posts/${postId}`);
  };

  return (
    <>
      {/* TODO: MainHeaderをひとつ上のルートに持っていって、ここからタイトルだけ変えるみたいなことできないかなあ */}
      <MainHeader title="投稿" canBack />
      {replySourcePost && (
        <div>
          <PostItem
            post={replySourcePost}
            onClick={handleClickPostItem}
            user={loggedInUser}
          />
          {/* TODO: 返信があるときはユーザーのアイコンを線で結びたい */}
          <div className="h-5 w-full flex justify-center">
            <div className="w-[1px] h-full bg-emerald-500" />
          </div>
        </div>
      )}
      <PostDetailItem
        post={post}
        user={loggedInUser}
        loggedInUserId={loggedInUser.id}
      />
      {replyPosts.length > 0 && (
        <>
          <div className="mt-10 ml-2 text-lg">返信</div>
          <div className="w-full h-[2px] bg-emerald-500" />
        </>
      )}
      {replyPosts.map((reply) => {
        return (
          <PostItem
            key={reply.id}
            post={reply}
            onClick={handleClickPostItem}
            user={loggedInUser}
          />
        );
      })}
      <Outlet />
    </>
  );
}

export const ErrorBoundary = () => {
  return (
    <>
      <MainHeader title="投稿" canBack />
      <li className="m-3 p-3 bg-red-200 flex rounded items-center">
        <MdError className="fill-red-500 w-5 h-5" />
        <p className="ml-2 text-red-800 font-bold">存在しない投稿です</p>
      </li>
    </>
  );
};
