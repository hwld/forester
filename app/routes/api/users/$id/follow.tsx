import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { db } from "~/lib/db.server";
import { findUser } from "~/models/user/finder.server";
import { Auth } from "~/services/authentication.server";

export const loader = () => {
  return redirect("/");
};

export const action = async ({ request, params }: ActionArgs) => {
  const userId = params.id;
  const loggedInUser = await Auth.requireUser(request);

  const user = await findUser({ where: { id: userId } });
  if (!user || userId === loggedInUser.id) {
    return json({}, { status: 400 });
  }

  await db.user.update({
    where: { id: userId },
    data: { followedBy: { connect: { id: loggedInUser.id } } },
  });

  return json({});
};
