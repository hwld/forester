import { Menu as HeadlessMenu } from "@headlessui/react";
import type { ReactNode } from "react";

type Props = { children: ReactNode };
export const MenuContainer: React.VFC<Props> = ({ children }) => {
  return (
    <HeadlessMenu as="div" className="relative">
      {children}
    </HeadlessMenu>
  );
};
