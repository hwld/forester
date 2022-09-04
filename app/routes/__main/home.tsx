import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { MainHeader } from "~/component/MainHeader";
import { PostForm } from "~/component/PostForm/PostForm";
import { PostItem } from "~/component/PostItem/PostItem";
import type { PostWithOwner } from "~/models/post";
import { findPostWithOwners } from "~/models/post/finder.server";
import type { User } from "~/models/user";
import { findUsers } from "~/models/user/finder.server";
import { Auth } from "~/services/authentication.server";

type LoaderData = {
  posts: PostWithOwner[];
  loggedInUser: User;
};
export const loader = async ({ request }: LoaderArgs) => {
  const loggedInUser = await Auth.requireUser(request);

  const followings = await findUsers({
    where: { followedBy: { some: { id: loggedInUser.id } } },
    loggedInUserId: loggedInUser.id,
  });

  const id = loggedInUser.id;
  const posts = await findPostWithOwners({
    where: {
      OR: [
        { userId: id },
        { userId: { in: followings.map((user) => user.id) } },
      ],
    },
    orderBy: { createdAt: "desc" },
    loggedInUserId: loggedInUser.id,
  });

  return json<LoaderData>({ posts, loggedInUser });
};

export default function Home() {
  const { posts, loggedInUser } = useLoaderData<typeof loader>();
  const navigator = useNavigate();

  const handleClickPostItem = (postId: string) => {
    navigator(`/posts/${postId}`);
  };

  return (
    <>
      <MainHeader title="ホーム" />
      <div className="border-b border-emerald-500">
        <PostForm />
      </div>
      <ul>
        {posts.map((post) => {
          return (
            <div key={post.id} className="">
              <PostItem
                onClick={handleClickPostItem}
                post={post}
                user={loggedInUser}
              />
            </div>
          );
        })}
      </ul>
    </>
  );
}
