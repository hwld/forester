import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/utils/session.server";

export const loader = () => {
  return redirect("/");
};

export const action = ({ request }: ActionArgs) => {
  return logout(request);
};
