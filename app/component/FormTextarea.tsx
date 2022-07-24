import { useMemo } from "react";
import type { TextareaProps } from "./Textarea";
import { Textarea } from "./Textarea";

type Props = {
  label: string;
  errors?: string[];
} & TextareaProps;

// TODO: FormInputと共通化
export const FormTextarea: React.VFC<Props> = ({ label, errors, ...props }) => {
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
        <Textarea isError={isError} {...props} />
      </div>
      {isError ? errorMessages : null}
    </div>
  );
};
