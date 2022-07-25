import type { IconType } from "react-icons";

type Props = { icon: IconType; size?: "md" | "lg" };

export const Icon: React.VFC<Props> = ({ icon, size = "md" }) => {
  const sizeClass = { md: "w-5 h-5", lg: "w-10 h-10" };

  const ReactIcon = icon;
  return <ReactIcon className={sizeClass[size]} />;
};
