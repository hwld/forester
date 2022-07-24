import type { ComponentPropsWithoutRef } from "react";

export type InputProps = { isError?: boolean } & Omit<
  ComponentPropsWithoutRef<"input">,
  "className"
>;

const inputClass =
  "py-2 px-3 border transition-shadow border-gray-300 rounded-md w-full focus:outline-none focus:ring-2";
const errorInputClass = `${inputClass} border-red-500 focus:border-red-500 focus:ring-red-500`;
const normalInputClass = `${inputClass} focus:border-emerald-400 focus:ring-emerald-400`;

export const Input: React.VFC<InputProps> = ({ isError, ...props }) => {
  return (
    <input
      {...props}
      className={isError ? errorInputClass : normalInputClass}
    />
  );
};
