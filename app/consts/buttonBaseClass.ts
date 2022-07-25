import clsx from "clsx";

export const buttonBaseClass = clsx(
  "flex justify-center items-center transition bg-orange-400",
  "focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-orange-200",
  "hover:bg-orange-600 disabled:bg-orange-700"
);
