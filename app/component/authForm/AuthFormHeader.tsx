type Props = {
  type: "login" | "signup";
};

export const AuthFormHeader: React.VFC<Props> = ({ type }) => {
  return (
    <div>
      <div>
        <img
          src="/icon.png"
          alt="logo"
          className="w-[100px] h-[100px] mx-auto"
        />
      </div>
      <h1 className="text-2xl font-bold text-center">
        {type === "login" ? "ログイン" : "ユーザー登録"}
      </h1>
    </div>
  );
};
