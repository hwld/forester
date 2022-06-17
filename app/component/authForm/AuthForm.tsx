import { AuthInput } from "./AuthInput";
import { AuthSubmitButton } from "./AuthSubmitButton";

type Props = { title: string; type: "login" | "signup" };

export const AuthForm: React.VFC<Props> = ({ title, type }) => {
  return (
    <div>
      <div>
        <img
          src="/icon.png"
          alt="logo"
          className="w-[100px] h-[100px] mx-auto"
        />
      </div>
      <h1 className="text-2xl font-bold text-center">{title}</h1>
      <div className="mt-5 p-5 bg-white shadow-md rounded-md">
        <div className="mt-5 space-y-4">
          <AuthInput label="ユーザー名" type="text" />
          <AuthInput label="パスワード" type="password" />
        </div>
        <div className="mt-5">
          <AuthSubmitButton text={type === "login" ? "ログイン" : "登録"} />
        </div>
      </div>
    </div>
  );
};
