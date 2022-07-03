import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { MdError } from "react-icons/md";
import { MainHeader } from "~/component/MainHeader";
import { PostDetailItem } from "~/component/PostDetailItem";
import { PostItem } from "~/component/PostItem/PostItem";
import { db } from "~/utils/db.server";
import type { Post } from "../home";

type PostTreeData = {
  post: Post;
  replySourcePost?: Post;
  replyPosts: Post[];
};

export const loader: LoaderFunction = async ({ params }) => {
  const postId = params.id;

  const rowPost = await db.post.findUnique({
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { username: true } },
      replyPosts: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { select: { username: true } },
          _count: { select: { replyPosts: true } },
        },
      },
      replySourcePost: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: { select: { username: true } },
          _count: { select: { replyPosts: true } },
          replySourcePost: { select: { user: { select: { username: true } } } },
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
  };

  const replySourcePost: Post | undefined = rowPost.replySourcePost
    ? {
        id: rowPost.replySourcePost.id,
        content: rowPost.replySourcePost.content,
        createdAt: rowPost.replySourcePost.createdAt.toUTCString(),
        username: rowPost.user.username,
        replyPostCount: rowPost.replySourcePost._count.replyPosts,
        replyingTo: rowPost.replySourcePost.replySourcePost?.user.username,
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
  const deletePostFetcher = useFetcher();

  const handleDeletePost = (id: string) => {
    deletePostFetcher.submit(null, {
      action: `/api/posts/${id}?index`,
      method: "delete",
    });
  };

  return (
    <>
      {/* TODO: MainHeaderをひとつ上のルートに持っていって、ここからタイトルだけ変えるみたいなことできないかなあ */}
      <MainHeader title="投稿" canBack />
      {replySourcePost ? (
        <div className="mt-2 mx-2">
          <PostItem post={replySourcePost} onDeletePost={handleDeletePost} />
          <div className="h-10 w-full flex justify-center">
            <div className="w-1 h-full bg-emerald-800" />
          </div>
        </div>
      ) : (
        <div className="h-2" />
      )}
      <div className="mx-2">
        <PostDetailItem post={post} onDeletePost={handleDeletePost} />
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
            <PostItem post={reply} onDeletePost={handleDeletePost} />
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
