import { Prisma } from "@prisma/client";
import { db } from "~/lib/db.server";
import type { Post, PostWithOwner } from ".";
import {
  convertToUser,
  findFollowingIds,
  userArgs,
} from "../user/finder.server";

const postArgsBase = Prisma.validator<Prisma.PostArgs>()({
  select: {
    id: true,
    content: true,
    createdAt: true,
    user: { select: { username: true, id: true, iconUrl: true } },
    _count: { select: { replyPosts: true, likes: true } },
    replySourcePost: {
      select: { user: { select: { username: true, id: true } } },
    },
  },
});
export const postArgs = Prisma.validator<Prisma.PostArgs>()({
  select: {
    ...postArgsBase.select,
    replySourcePost: postArgsBase,
  },
});

const postWithOwnerArgsBase = Prisma.validator<Prisma.PostArgs>()({
  select: {
    ...postArgsBase.select,
    user: userArgs,
  },
});

const postWithOwnerArgs = Prisma.validator<Prisma.PostArgs>()({
  select: {
    ...postWithOwnerArgsBase.select,
    replySourcePost: postWithOwnerArgsBase,
  },
});

type ConvertToPostParams = {
  rawPost: Prisma.PostGetPayload<typeof postArgsBase>;
  loggedInUserLikingPostIds?: string[];
};
const convertToPost = ({
  rawPost: { id, content, createdAt, _count, user, replySourcePost },
  loggedInUserLikingPostIds = [],
}: ConvertToPostParams): Post => {
  return {
    id,
    content,
    createdAt: createdAt.toUTCString(),
    replyPostCount: _count.replyPosts,
    username: user.username,
    userId: user.id,
    userIconUrl: user.iconUrl,
    replySourceUsername: replySourcePost?.user.username,
    likesCount: _count.likes,
    likedByLoggedInUser: loggedInUserLikingPostIds.includes(id),
  };
};

type ConvertToPostWithOwnerParams = {
  rawPost: Prisma.PostGetPayload<typeof postWithOwnerArgsBase>;
  loggedInUserLikingPostIds?: string[];
  loggedInUserFollowingIds?: string[];
};
const convertToPostWithOwner = ({
  rawPost,
  loggedInUserLikingPostIds,
  loggedInUserFollowingIds,
}: ConvertToPostWithOwnerParams): PostWithOwner => {
  return {
    ...convertToPost({ rawPost, loggedInUserLikingPostIds }),
    owner: convertToUser({ rawUser: rawPost.user, loggedInUserFollowingIds }),
  };
};

export const findLikingPostIds = async (userId: string) => {
  const post = await db.post.findMany({
    select: { id: true },
    where: { likes: { some: { userId } } },
  });

  return post.map((p) => p.id);
};

type FindPostParams = {
  where: Prisma.PostFindFirstArgs["where"];
  loggedInUserId?: string;
};
type FindPostResult =
  | { post: Post; replySourcePost: Post | undefined }
  | undefined;
export const findPost = async ({
  where,
  loggedInUserId,
}: FindPostParams): Promise<FindPostResult> => {
  const rawPost = await db.post.findFirst({
    ...postArgs,
    where,
  });

  if (!rawPost) {
    return undefined;
  }

  const loggedInUserLikingPostIds = loggedInUserId
    ? await findLikingPostIds(loggedInUserId)
    : [];

  const post = convertToPost({ rawPost, loggedInUserLikingPostIds });
  const replySourcePost: Post | undefined = rawPost.replySourcePost
    ? convertToPost({
        rawPost: rawPost.replySourcePost,
        loggedInUserLikingPostIds,
      })
    : undefined;

  return { post, replySourcePost };
};

type FindPostsParams = {
  where?: Prisma.PostFindManyArgs["where"];
  orderBy?: Prisma.PostFindManyArgs["orderBy"];
  loggedInUserId?: string;
};
export const findPosts = async ({
  loggedInUserId,
  ...args
}: FindPostsParams): Promise<Post[]> => {
  const rawPosts = await db.post.findMany({
    ...postArgs,
    ...args,
  });

  const loggedInUserLikingPostIds = loggedInUserId
    ? await findLikingPostIds(loggedInUserId)
    : [];

  const posts: Post[] = rawPosts.map((post) => {
    return convertToPost({ rawPost: post, loggedInUserLikingPostIds });
  });

  return posts;
};

export const findPostWithOwner = async ({
  loggedInUserId,
  ...args
}: FindPostParams) => {
  const loggedInUserFollowingIds = loggedInUserId
    ? await findFollowingIds(loggedInUserId)
    : [];

  const loggedInUserLikingPostIds = loggedInUserId
    ? await findLikingPostIds(loggedInUserId)
    : [];

  const rawPost = await db.post.findFirst({ ...postWithOwnerArgs, ...args });
  if (!rawPost) {
    return undefined;
  }

  const post = convertToPostWithOwner({
    rawPost,
    loggedInUserFollowingIds,
    loggedInUserLikingPostIds,
  });
  const replySourcePost: PostWithOwner | undefined = rawPost.replySourcePost
    ? convertToPostWithOwner({
        rawPost: rawPost.replySourcePost,
        loggedInUserFollowingIds,
        loggedInUserLikingPostIds,
      })
    : undefined;

  return { post, replySourcePost };
};

export const findPostWithOwners = async ({
  loggedInUserId,
  ...args
}: FindPostsParams): Promise<PostWithOwner[]> => {
  const rawPosts = await db.post.findMany({ ...postWithOwnerArgs, ...args });
  const loggedInUserFollowingIds = loggedInUserId
    ? await findFollowingIds(loggedInUserId)
    : [];
  const loggedInUserLikingPostIds = loggedInUserId
    ? await findLikingPostIds(loggedInUserId)
    : [];

  const posts: PostWithOwner[] = rawPosts.map((post) => {
    return convertToPostWithOwner({
      rawPost: post,
      loggedInUserFollowingIds,
      loggedInUserLikingPostIds,
    });
  });

  return posts;
};
