import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Fragment, useMemo } from "react";

type Props = {
  children: ReactNode;
  align?: "left" | "right";
  position?: "top" | "buttom";
};
export const MenuItems: React.VFC<Props> = ({
  children,
  align = "right",
  position = "buttom",
}) => {
  const alignClass = useMemo(() => {
    switch (align) {
      case "right": {
        return "right-0";
      }
      case "left": {
        return "left-0";
      }
    }
  }, [align]);

  const positionClass = useMemo(() => {
    switch (position) {
      case "top": {
        return "bottom-full mb-2";
      }
      case "buttom": {
        return "mt-2";
      }
    }
  }, [position]);

  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items
        className={clsx(
          "absolute border bg-slate-200 border-slate-400 w-56 shadow-md rounded",
          alignClass,
          positionClass
        )}
      >
        {children}
      </Menu.Items>
    </Transition>
  );
};
