import { useMemo } from "react";
import type { InputProps } from "./Input";
import { Input } from "./Input";
import type { TextareaProps } from "./Textarea";
import { Textarea } from "./Textarea";

type Props = {
  label: string;
  errors?: string[];
} & (
  | ({ controlType: "input" } & InputProps)
  | ({ controlType: "textarea" } & TextareaProps)
);

export const FormControl: React.VFC<Props> = ({ label, errors, ...props }) => {
  const isError = errors !== undefined && errors.length > 0;

  const control = useMemo(() => {
    console.log(props.controlType);
    if (props.controlType === "input") {
      const { controlType, ...others } = { ...props };
      return <Input isError={isError} {...others} />;
    }
    if (props.controlType === "textarea") {
      const { controlType, ...others } = { ...props };
      return <Textarea isError={isError} {...others} />;
    }

    return undefined;
  }, [isError, props]);

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
      <div>{control}</div>
      {isError ? errorMessages : null}
    </div>
  );
};
