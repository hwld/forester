import { Prisma } from "@prisma/client";
import { db } from "~/utils/db.server";

// Prismaのデータから実際に使用するデータに変換を行うためにmodelファイルを作った。
// PrismaClientをRemix側のactionなどから隠蔽する意図はないので、createやdeleteなどの操作系の
// APIはactionから直接使用している。
// 中間処理をはさみたくなったときにここに書く

export type Post = {
  id: string;
  content: string;
  username: string;
  createdAt: string;
  replyPostCount: number;
  replySourceUsername: string | undefined;
  isOwner: boolean;
};

const postArgsBase = Prisma.validator<Prisma.PostArgs>()({
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
});
export const postArgs = Prisma.validator<Prisma.PostArgs>()({
  select: {
    id: true,
    content: true,
    createdAt: true,
    user: { select: { username: true, id: true } },
    _count: { select: { replyPosts: true } },
    replySourcePost: postArgsBase,
  },
});

const convertToPost = (
  {
    id,
    content,
    createdAt,
    _count,
    user,
    replySourcePost,
  }: Prisma.PostGetPayload<typeof postArgsBase>,
  loggedInUserId: string | undefined
): Post => {
  const post: Post = {
    id,
    content,
    createdAt: createdAt.toUTCString(),
    replyPostCount: _count.replyPosts,
    username: user.username,
    replySourceUsername: replySourcePost?.user.username,
    isOwner: user.id === loggedInUserId,
  };

  return post;
};

type FindPostParams = (
  | { type: "unique"; where?: Prisma.PostFindUniqueArgs["where"] }
  | { type?: "first"; where?: Prisma.PostFindFirstArgs["where"] }
) & {
  loggedInUserId?: string;
};
type FindPostResult =
  | { post: Post; replySourcePost: Post | undefined }
  | undefined;
export const findPost = async (
  params: FindPostParams
): Promise<FindPostResult> => {
  let rawPost;
  if (params.type === "unique") {
    rawPost = await db.post.findUnique({
      ...postArgs,
      where: params.where ?? {},
    });
  } else {
    rawPost = await db.post.findFirst({
      ...postArgs,
      where: params.where ?? {},
    });
  }

  if (!rawPost) {
    return undefined;
  }

  const loggedInUserId = params.loggedInUserId;
  const post = convertToPost(rawPost, loggedInUserId);
  const replySourcePost: Post | undefined = rawPost.replySourcePost
    ? convertToPost(rawPost.replySourcePost, loggedInUserId)
    : undefined;

  return { post, replySourcePost };
};

type FindPostsParams = {
  where?: Prisma.PostFindManyArgs["where"];
  orderBy?: Prisma.PostFindManyArgs["orderBy"];
  loggedInUserId?: string;
};
export const findPosts = async ({
  where = {},
  orderBy = {},
  loggedInUserId,
}: FindPostsParams): Promise<Post[]> => {
  const rawPosts = await db.post.findMany({
    ...postArgs,
    where,
    orderBy,
  });

  const posts: Post[] = rawPosts.map((post) => {
    return convertToPost(post, loggedInUserId);
  });

  return posts;
};
