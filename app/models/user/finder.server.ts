import { Prisma } from "@prisma/client";
import { db } from "~/lib/db.server";
import type { User } from ".";

export const userArgs = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    username: true,
    profile: true,
    iconUrl: true,
    _count: { select: { followedBy: true, following: true } },
  },
});

type ConvertToUserParams = {
  rawUser: Prisma.UserGetPayload<typeof userArgs>;
  loggedInUserFollowingIds?: string[];
};
export const convertToUser = ({
  rawUser,
  loggedInUserFollowingIds = [],
}: ConvertToUserParams): User => {
  return {
    username: rawUser.username,
    profile: rawUser.profile,
    id: rawUser.id,
    iconUrl: rawUser.iconUrl,
    followedByLoggedInUser: loggedInUserFollowingIds.includes(rawUser.id),
    followersCount: rawUser._count.followedBy,
    followingsCount: rawUser._count.following,
  };
};

export const findFollowingIds = async (userId: string) => {
  const user = await db.user.findFirst({
    select: { ...userArgs.select, following: true },
    where: { id: userId },
  });

  return user?.following.map((f) => f.id);
};

type FindUsersLikedPostParams = {
  postId: string;
  loggedInUserId: string;
};
export const findUsersLikedPost = async ({
  postId,
  loggedInUserId,
}: FindUsersLikedPostParams) => {
  const rawUsers = await db.user.findMany({
    select: { ...userArgs.select },
    where: { likes: { some: { postId } } },
  });

  const loggedInUserFollowingIds = loggedInUserId
    ? await findFollowingIds(loggedInUserId)
    : [];

  const users = rawUsers.map((rawUser) => {
    return convertToUser({ rawUser, loggedInUserFollowingIds });
  });

  return users;
};

type FindUserParams = {
  where: Prisma.UserFindFirstArgs["where"];
  loggedInUserId?: string;
};
export const findUser = async ({ where, loggedInUserId }: FindUserParams) => {
  const rawUser = await db.user.findFirst({ ...userArgs, where });
  if (!rawUser) {
    return undefined;
  }

  const loggedInUserFollowingIds = loggedInUserId
    ? await findFollowingIds(loggedInUserId)
    : [];
  return convertToUser({ rawUser, loggedInUserFollowingIds });
};

type FindUsersParams = {
  loggedInUserId?: string;
  where?: Prisma.UserFindManyArgs["where"];
  orderBy?: Prisma.UserFindManyArgs["orderBy"];
};
export const findUsers = async ({
  loggedInUserId,
  ...args
}: FindUsersParams) => {
  const rawUsers = await db.user.findMany({ ...userArgs, ...args });

  const loggedInUserFollowingIds = loggedInUserId
    ? await findFollowingIds(loggedInUserId)
    : [];

  const users = rawUsers.map((rawUser): User => {
    return convertToUser({ rawUser, loggedInUserFollowingIds });
  });

  return users;
};
