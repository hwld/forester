import clsx from "clsx";

export const buttonBaseClass = clsx(
  "flex justify-center items-center transition bg-emerald-400",
  "focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-emerald-200",
  "hover:bg-emerald-500 disabled:bg-emerald-600"
);
