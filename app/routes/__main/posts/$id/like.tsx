import { Dialog } from "@headlessui/react";
import type { ActionArgs } from "@remix-run/node";
import { json, Response } from "@remix-run/node";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { MdOutlineClose } from "react-icons/md";
import { UserItem } from "~/component/UserItem";
import { routingFromSchema } from "~/lib/routingFrom";
import { findUsersLikedPost } from "~/models/user/finder.server";
import { Auth } from "~/services/authentication.server";

export const loader = async ({ request, params }: ActionArgs) => {
  const loggedInUser = await Auth.requireUser(request);
  const postId = params.id;
  if (!postId) {
    throw new Response("Not Found", { status: 404 });
  }

  const users = await findUsersLikedPost({
    postId,
    loggedInUserId: loggedInUser.id,
  });

  return json({ users, loggedInUser });
};

const isFromObject = (value: unknown): value is { from: string } => {
  if (value == null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return typeof obj.from === "string";
};

export default function Like() {
  const params = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { users, loggedInUser } = useLoaderData<typeof loader>();

  const handleCloseDialog = () => {
    // サイト内から遷移した場合はbackを使用する。
    const result = routingFromSchema.safeParse(state);
    if (result.success && result.data.from === "onSite") {
      navigate(-1);
    } else {
      // サイト外から遷移してきた場合はその投稿のページに遷移させる。
      navigate(`/posts/${params.id}`, { replace: true });
    }
  };

  return (
    <Dialog open={true} onClose={handleCloseDialog}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true"></div>
      <div
        className="fixed inset-0 flex items-center justify-center py-4 px-5 "
        onClick={(e) => e.stopPropagation()}
      >
        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-slate-200 flex flex-col items-stretch p-2 transition-all">
          <div className="flex items-center space-x-5">
            <button onClick={handleCloseDialog}>
              <MdOutlineClose className="w-8 h-8" />
            </button>
            <h2 className="text-xl font-bold">いいねしたユーザー</h2>
          </div>
          <ul className="flex flex-col mt-3">
            {users.map((user) => {
              return (
                <UserItem
                  key={user.id}
                  user={user}
                  isOwner={loggedInUser.id === user.id}
                  isFollowing={user.followedByLoggedInUser ?? false}
                  border={false}
                />
              );
            })}
          </ul>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
