import type { ComponentProps } from "react";

type Props = {
  label: string;
  type?: ComponentProps<"input">["type"];
};

export const AuthInput: React.VFC<Props> = ({ label, type }) => {
  return (
    <div>
      <label className="block text-sm mb-2">{label}</label>
      <div>
        <input
          type={type}
          className="py-2 px-3 border transition-shadow border-gray-300  focus:border-emerald-400 rounded-md w-full 
            focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>
    </div>
  );
};
