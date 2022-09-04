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
