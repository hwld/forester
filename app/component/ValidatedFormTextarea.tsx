import { useField } from "remix-validated-form";
import type { VariableTextAreaProps } from "./VariableTextArea";
import { VariableTextArea } from "./VariableTextArea";

type Props = {
  name: string;
  label?: string;
} & VariableTextAreaProps;
export const ValidatedFormTextarea: React.VFC<Props> = ({
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
      <VariableTextArea
        isError={error !== undefined}
        {...getInputProps()}
        {...rest}
      />
      {error ? <p className="text-red-400 text-sm">{error}</p> : null}
    </div>
  );
};
