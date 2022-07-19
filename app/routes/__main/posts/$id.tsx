import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { MdError } from "react-icons/md";
import { MainHeader } from "~/component/MainHeader";
import { PostDetailItem } from "~/component/PostItem/PostDetailItem";
import { PostItem } from "~/component/PostItem/PostItem";
import type { Post } from "~/models/post";
import { findPost, findPosts } from "~/models/post";
import { getUser } from "~/utils/session.server";

type PostTreeData = {
  post: Post;
  replySourcePost?: Post;
  replyPosts: Post[];
  loggedInUserId?: string;
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const loggedInUser = await getUser(request);
  const postId = params.id;

  if (!postId) {
    throw new Error("サーバーでエラーが発生しました。");
  }

  const postData = await findPost({
    where: { id: postId },
  });
  if (!postData) {
    throw new Error("投稿が見つかりませんでした。");
  }

  const { post, replySourcePost } = postData;
  const replyPosts = await findPosts({
    where: { id: postId },
  });

  return json<PostTreeData>({
    post,
    replySourcePost,
    replyPosts,
    loggedInUserId: loggedInUser?.id,
  });
};

export default function PostTree() {
  const { post, replySourcePost, replyPosts, loggedInUserId } =
    useLoaderData<typeof loader>();
  const navigator = useNavigate();

  const handleClickPostItem = (postId: string) => {
    navigator(`/posts/${postId}`);
  };

  return (
    <>
      {/* TODO: MainHeaderをひとつ上のルートに持っていって、ここからタイトルだけ変えるみたいなことできないかなあ */}
      <MainHeader title="投稿" canBack />
      {replySourcePost ? (
        <div className="mt-2 mx-2">
          <PostItem
            post={replySourcePost}
            onClick={handleClickPostItem}
            loggedInUserId={loggedInUserId}
          />
          <div className="h-10 w-full flex justify-center">
            <div className="w-1 h-full bg-emerald-800" />
          </div>
        </div>
      ) : (
        <div className="h-2" />
      )}
      <div className="mx-2">
        <PostDetailItem post={post} loggedInUserId={loggedInUserId} />
      </div>
      {replyPosts.length > 0 && (
        <>
          <div className="mt-10 ml-2 text-lg text-white">返信</div>
          <div className="w-full h-[3px] bg-emerald-300" />
        </>
      )}
      {replyPosts.map((reply) => {
        return (
          <div key={reply.id} className="m-2 mt-3">
            <PostItem
              post={reply}
              onClick={handleClickPostItem}
              loggedInUserId={loggedInUserId}
            />
          </div>
        );
      })}
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
