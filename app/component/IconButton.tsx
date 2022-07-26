import clsx from "clsx";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { buttonBaseClass } from "~/consts/buttonBaseClass";

// いつもはサボってclassNameを渡してコンポーネント内部のスタイリングを
// やっているのだが、uhyoさんの記事(https://blog.uhy.ooo/entry/2020-12-19/css-component-design/)
// に従って、そのコンポーネントが責任を負う挙動のみをpropsとして受け取るようにしてみる。
type Props = {
  icon: ReactNode;
  size?: "sm" | "md" | "lg";
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

export const IconButton: React.VFC<Props> = ({
  icon,
  size = "md",
  ...buttonProps
}) => {
  const sizeClass = {
    sm: "w-7 h-7",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <button
      className={clsx(buttonBaseClass, "rounded-full", sizeClass[size])}
      {...buttonProps}
    >
      <div>{icon}</div>
    </button>
  );
};
