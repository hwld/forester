import type { ComponentProps, ReactNode } from "react";

// いつもはサボってclassNameを渡してコンポーネント内部のスタイリングを
// やっているのだが、uhyoさんの記事(https://blog.uhy.ooo/entry/2020-12-19/css-component-design/)
// に従って、そのコンポーネントが責任を負う挙動のみをpropsとして受け取るようにしてみる。
type Props = {
  icon: ReactNode;
  text?: string;
  textBold?: boolean;
  fullWidth?: boolean;
} & Omit<ComponentProps<"button">, "className">;

export const IconButton: React.VFC<Props> = ({
  text,
  icon,
  textBold = false,
  fullWidth = false,
  ...buttonProps
}) => {
  return (
    <button
      {...buttonProps}
      className={`transition bg-emerald-300 hover:bg-emerald-400 px-3 py-2 rounded-md flex ${
        textBold ? "font-bold" : ""
      } ${fullWidth ? "w-full" : ""}`}
    >
      <div>{icon}</div>
      <div className="ml-1 hidden lg:block">{text}</div>
    </button>
  );
};
