import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Auth } from "~/services/authentication.server";

export const loader = () => {
  return redirect("/");
};

export const action = ({ request }: ActionArgs) => {
  return Auth.logout(request);
};
