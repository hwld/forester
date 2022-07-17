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
  userId: string;
  createdAt: string;
  replyPostCount: number;
  replySourceUsername: string | undefined;
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
    replySourceUsername: replySourcePost?.user.username,
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
