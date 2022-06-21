import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
export const action: ActionFunction = async () => {
  return null;
};
