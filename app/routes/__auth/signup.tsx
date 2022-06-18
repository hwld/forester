import type { ActionFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { AuthForm } from "~/component/authForm/AuthForm";

export const action: ActionFunction = async ({ request }) => {
  
};

export default function Signup() {
  return (
    <>
      <AuthForm type="signup" />
      <p className="self-start mt-1">
        アカウントをお持ちの方は{" "}
        <Link to="/login" className="text-emerald-500 font-bold underline">
          ログインへ
        </Link>
      </p>
    </>
  );
}
