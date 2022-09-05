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
    _count: { select: { replyPosts: true } },
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

const convertToPost = ({
  id,
  content,
  createdAt,
  _count,
  user,
  replySourcePost,
}: Prisma.PostGetPayload<typeof postArgsBase>): Post => {
  return {
    id,
    content,
    createdAt: createdAt.toUTCString(),
    replyPostCount: _count.replyPosts,
    username: user.username,
    userId: user.id,
    userIconUrl: user.iconUrl,
    replySourceUsername: replySourcePost?.user.username,
  };
};

type ConvertToPostWithOwnerParams = {
  rawPost: Prisma.PostGetPayload<typeof postWithOwnerArgsBase>;
  loggedInUserFollowingIds?: string[];
};
const convertToPostWithOwner = ({
  rawPost,
  loggedInUserFollowingIds,
}: ConvertToPostWithOwnerParams): PostWithOwner => {
  return {
    ...convertToPost(rawPost),
    owner: convertToUser({ rawUser: rawPost.user, loggedInUserFollowingIds }),
  };
};

type FindPostParams = { where: Prisma.PostFindFirstArgs["where"] };
type FindPostResult =
  | { post: Post; replySourcePost: Post | undefined }
  | undefined;
export const findPost = async ({
  where,
}: FindPostParams): Promise<FindPostResult> => {
  const rawPost = await db.post.findFirst({
    ...postArgs,
    where,
  });

  if (!rawPost) {
    return undefined;
  }

  const post = convertToPost(rawPost);
  const replySourcePost: Post | undefined = rawPost.replySourcePost
    ? convertToPost(rawPost.replySourcePost)
    : undefined;

  return { post, replySourcePost };
};

type FindPostsParams = {
  where?: Prisma.PostFindManyArgs["where"];
  orderBy?: Prisma.PostFindManyArgs["orderBy"];
};
export const findPosts = async (args: FindPostsParams): Promise<Post[]> => {
  const rawPosts = await db.post.findMany({
    ...postArgs,
    ...args,
  });

  const posts: Post[] = rawPosts.map((post) => {
    return convertToPost(post);
  });

  return posts;
};

export const findPostWithOwner = async ({
  loggedInUserId,
  ...args
}: FindPostParams & {
  loggedInUserId?: string;
}) => {
  const loggedInUserFollowingIds = loggedInUserId
    ? await findFollowingIds(loggedInUserId)
    : [];

  const rawPost = await db.post.findFirst({ ...postWithOwnerArgs, ...args });
  if (!rawPost) {
    return undefined;
  }

  const post = convertToPostWithOwner({
    rawPost,
    loggedInUserFollowingIds,
  });
  const replySourcePost: PostWithOwner | undefined = rawPost.replySourcePost
    ? convertToPostWithOwner({
        rawPost: rawPost.replySourcePost,
        loggedInUserFollowingIds,
      })
    : undefined;

  return { post, replySourcePost };
};

export const findPostWithOwners = async ({
  loggedInUserId,
  ...args
}: FindPostsParams & { loggedInUserId?: string }): Promise<PostWithOwner[]> => {
  const rawPosts = await db.post.findMany({ ...postWithOwnerArgs, ...args });
  const loggedInUserFollowingIds = loggedInUserId
    ? await findFollowingIds(loggedInUserId)
    : [];

  const posts: PostWithOwner[] = rawPosts.map((post) => {
    return convertToPostWithOwner({ rawPost: post, loggedInUserFollowingIds });
  });

  return posts;
};
