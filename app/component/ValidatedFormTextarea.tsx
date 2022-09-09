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
  | ({ isVariable: false } & TextareaProps)
);
export const ValidatedFormTextarea: React.VFC<Props> = ({
  name,
  label,
  isVariable,
  ...rest
}) => {
  const { error, getInputProps } = useField(name);

  const textArea = useMemo(() => {
    if (isVariable) {
      return (
        <VariableTextArea
          isError={error !== undefined}
          {...getInputProps()}
          {...rest}
        />
      );
    } else {
      return <Textarea {...getInputProps()} {...rest} />;
    }
  }, [error, getInputProps, isVariable, rest]);

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
