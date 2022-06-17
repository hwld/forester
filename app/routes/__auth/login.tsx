import { Link } from "@remix-run/react";
import { AuthForm } from "~/component/authForm/AuthForm";

export default function Login() {
  return (
    <>
      <AuthForm title="ログイン" type="login" />
      <p className="self-start mt-1">
        初めての方は{" "}
        <Link to="/signup" className="text-emerald-500 font-bold underline">
          ユーザー登録へ
        </Link>
      </p>
    </>
  );
}
