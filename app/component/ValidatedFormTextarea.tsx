import { useMemo } from "react";
import { useField } from "remix-validated-form";
import type { TextareaProps } from "./Textarea";
import { Textarea } from "./Textarea";
import type { VariableTextAreaProps } from "./VariableTextArea";
import { VariableTextArea } from "./VariableTextArea";

type Props = {
  name: string;
  label?: string;
} & (
  | ({ isVariable: true } & VariableTextAreaProps)
  | ({ isVariable?: false } & TextareaProps)
);
export const ValidatedFormTextarea: React.VFC<Props> = ({
  name,
  label,
  ...rest
}) => {
  const { error, getInputProps } = useField(name);

  const textArea = useMemo(() => {
    if (rest.isVariable) {
      const { isVariable, ...props } = rest;
      return (
        <VariableTextArea
          isError={error !== undefined}
          {...getInputProps()}
          {...props}
        />
      );
    } else {
      const { isVariable, ...props } = rest;
      return <Textarea {...getInputProps()} {...props} />;
    }
  }, [error, getInputProps, rest]);

  return (
    <div>
      {label && (
        <label className="block text-gray-500 text-sm mb-1">{label}</label>
      )}
      {textArea}
      {error ? <p className="text-red-400 text-sm">{error}</p> : null}
    </div>
  );
};
