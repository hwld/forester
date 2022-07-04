import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { MdError } from "react-icons/md";
import { MainHeader } from "~/component/MainHeader";
import { PostDetailItem } from "~/component/PostItem/PostDetailItem";
import { PostItem } from "~/component/PostItem/PostItem";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import type { Post } from "../home";

type PostTreeData = {
  post: Post;
  replySourcePost?: Post;
  replyPosts: Post[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const loggedInUser = await getUser(request);
  const postId = params.id;

  const rowPost = await db.post.findUnique({
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { username: true, id: true } },
      replyPosts: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { select: { username: true, id: true } },
          _count: { select: { replyPosts: true } },
        },
      },
      replySourcePost: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { select: { username: true, id: true } },
          _count: { select: { replyPosts: true } },
          replySourcePost: {
            select: { user: { select: { username: true, id: true } } },
          },
        },
      },
    },
    where: { id: postId },
  });

  if (!rowPost) {
    throw new Error("");
  }

  const post: Post = {
    id: rowPost.id,
    content: rowPost.content,
    createdAt: rowPost.createdAt.toUTCString(),
    replyPostCount: rowPost.replyPosts.length,
    username: rowPost.user.username,
    replyingTo: rowPost.replySourcePost?.user.username,
    isOwner: rowPost.user.id === loggedInUser?.id,
  };

  const replySourcePost: Post | undefined = rowPost.replySourcePost
    ? {
        id: rowPost.replySourcePost.id,
        content: rowPost.replySourcePost.content,
        createdAt: rowPost.replySourcePost.createdAt.toUTCString(),
        username: rowPost.user.username,
        replyPostCount: rowPost.replySourcePost._count.replyPosts,
        replyingTo: rowPost.replySourcePost.replySourcePost?.user.username,
        isOwner: rowPost.replySourcePost.user.id === loggedInUser?.id,
      }
    : undefined;

  const replyPosts: Post[] = rowPost.replyPosts.map((rowReply) => {
    return {
      id: rowReply.id,
      content: rowReply.content,
      createdAt: rowReply.createdAt.toUTCString(),
      username: rowReply.user.username,
      replyPostCount: rowReply._count.replyPosts,
      replyingTo: post.username,
      isOwner: rowReply.user.id === loggedInUser?.id,
    };
  });

  return json<PostTreeData>({
    post,
    replySourcePost,
    replyPosts,
  });
};

export default function PostTree() {
  const { post, replySourcePost, replyPosts } = useLoaderData<PostTreeData>();
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
          <PostItem post={replySourcePost} onClick={handleClickPostItem} />
          <div className="h-10 w-full flex justify-center">
            <div className="w-1 h-full bg-emerald-800" />
          </div>
        </div>
      ) : (
        <div className="h-2" />
      )}
      <div className="mx-2">
        <PostDetailItem post={post} />
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
            <PostItem post={reply} onClick={handleClickPostItem} />
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
