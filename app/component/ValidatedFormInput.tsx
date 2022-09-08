import type { ComponentPropsWithoutRef } from "react";
import { useField } from "remix-validated-form";
import { Input } from "./Input";

type Props = {
  name: string;
  label: string;
} & ComponentPropsWithoutRef<"input">;
export const ValidatedFormInput: React.VFC<Props> = ({
  name,
  label,
  ...rest
}) => {
  const { error, getInputProps } = useField(name);
  return (
    <div>
      {label && (
        <label className="block text-gray-500 text-sm mb-1">{label}</label>
      )}
      <Input isError={error !== undefined} {...getInputProps()} {...rest} />
      {error ? <p className="text-red-400 text-sm">{error}</p> : null}
    </div>
  );
};
