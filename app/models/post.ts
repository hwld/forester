import { db } from "~/utils/db.server";

export type Post = {
  id: string;
  content: string;
  username: string;
  createdAt: string;
  replyPostCount: number;
  replySourceUsername: string | undefined;
  isOwner: boolean;
};

type FindPostParams = { postId: string; loggedInUserId: string | undefined };
type FindPostResult =
  | { post: Post; replySourcePost: Post | undefined }
  | undefined;
export const findPost = async ({
  postId,
  loggedInUserId,
}: FindPostParams): Promise<FindPostResult> => {
  const rawPost = await db.post.findUnique({
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { username: true, id: true } },
      _count: { select: { replyPosts: true } },
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

  if (!rawPost) {
    return undefined;
  }

  const post: Post = {
    id: rawPost.id,
    content: rawPost.content,
    createdAt: rawPost.createdAt.toUTCString(),
    replyPostCount: rawPost._count.replyPosts,
    username: rawPost.user.username,
    replySourceUsername: rawPost.replySourcePost?.user.username,
    isOwner: rawPost.user.id === loggedInUserId,
  };

  const replySourcePost: Post | undefined = rawPost.replySourcePost
    ? {
        id: rawPost.replySourcePost.id,
        content: rawPost.replySourcePost.content,
        createdAt: rawPost.replySourcePost.createdAt.toUTCString(),
        username: rawPost.user.username,
        replyPostCount: rawPost.replySourcePost._count.replyPosts,
        replySourceUsername:
          rawPost.replySourcePost.replySourcePost?.user.username,
        isOwner: rawPost.replySourcePost.user.id === loggedInUserId,
      }
    : undefined;

  return { post, replySourcePost };
};

type FindReplyPostsParams = {
  postId: string;
  loggedInUserId: string | undefined;
};
export const findReplyPosts = async ({
  postId,
  loggedInUserId,
}: FindReplyPostsParams): Promise<Post[]> => {
  const rawPosts = await db.post.findMany({
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
    where: { replySourcePostId: postId },
  });

  const replyPosts: Post[] = rawPosts.map((post) => {
    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt.toUTCString(),
      username: post.user.username,
      replyPostCount: post._count.replyPosts,
      replySourceUsername: post.replySourcePost?.user.username,
      isOwner: post.replySourcePost?.user.id === loggedInUserId,
    };
  });

  return replyPosts;
};

type FindPostByUserIdParams = {
  userId: string;
  loggedInUserId: string | undefined;
};
export const findPostByUserId = async ({
  userId,
  loggedInUserId,
}: FindPostByUserIdParams) => {
  const rawPosts = await db.post.findMany({
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { username: true, id: true } },
      replySourcePost: { select: { user: { select: { username: true } } } },
      _count: { select: { replyPosts: true } },
    },
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });

  const posts: Post[] = rawPosts.map((raw) => ({
    id: raw.id,
    content: raw.content,
    username: raw.user.username,
    createdAt: raw.createdAt.toUTCString(),
    replyPostCount: raw._count.replyPosts,
    replySourceUsername: raw.replySourcePost?.user.username,
    isOwner: raw.user.id === loggedInUserId,
  }));

  return posts;
};
