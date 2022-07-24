import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { db } from "~/utils/db.server";

export type User = {
  id: string;
  username: string;
  profile: string;
  iconUrl: string;
  followersCount: number;
  followingsCount: number;
  followedByLoggedInUser?: boolean;
};

export type UserAndFollowers = {
  user: User;
  followers: User[];
};

export type UserAndFollowings = {
  user: User;
  followings: User[];
};

export const authentication = async (username: string, password: string) => {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) {
    return false;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    return false;
  }

  return user.id;
};

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
const convertToUser = ({
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

const findFollowingIds = async (userId: string) => {
  const user = await db.user.findFirst({
    ...userArgs,
    select: { ...userArgs.select, following: true },
    where: { id: userId },
  });

  return user?.following.map((f) => f.id);
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
