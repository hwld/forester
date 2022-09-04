import type { User } from "../user/index";

export type Post = {
  id: string;
  content: string;
  username: string;
  userId: string;
  userIconUrl: string;
  createdAt: string;
  replyPostCount: number;
  replySourceUsername: string | undefined;
};

export type PostWithOwner = Post & { owner: User };
