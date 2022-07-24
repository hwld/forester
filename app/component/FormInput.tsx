import type { ComponentProps } from "react";
import { useMemo } from "react";
import { Input } from "./Input";

type Props = {
  label: string;
  errors?: string[];
} & ComponentProps<"input">;

export const FormInput: React.VFC<Props> = ({
  label,
  errors,
  ...inputProps
}) => {
  const isError = errors !== undefined && errors.length > 0;

  const errorMessages = useMemo(() => {
    return (
      <ul className="ml-3">
        {errors?.map((error, i) => {
          return (
            <p key={i} className="text-red-400 text-sm">
              {error}
            </p>
          );
        })}
      </ul>
    );
  }, [errors]);

  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <div>
        <Input isError={isError} {...inputProps} />
      </div>
      {isError ? errorMessages : null}
    </div>
  );
};
