import type { ComponentProps } from "react";

type Props = {
  label: string;
  errorMessage?: string;
} & ComponentProps<"input">;

const inputClass =
  "py-2 px-3 border transition-shadow border-gray-300 rounded-md w-full focus:outline-none focus:ring-2";
const errorInputClass = `${inputClass} border-red-500 focus:border-red-500 focus:ring-red-500`;
const normalInputClass = `${inputClass} focus:border-emerald-400 focus:ring-emerald-400`;

export const AuthInput: React.VFC<Props> = ({
  label,
  errorMessage,
  ...inputProps
}) => {
  const isError = errorMessage !== undefined && errorMessage.length > 0;

  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <div>
        <input
          {...inputProps}
          className={isError ? errorInputClass : normalInputClass}
        />
      </div>
      {errorMessage ? (
        <p className="text-red-400 text-sm">{errorMessage}</p>
      ) : null}
    </div>
  );
};
