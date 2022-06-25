import type { ChangeEventHandler, ComponentProps } from "react";
import { useLayoutEffect, useRef } from "react";

type Props = {
  minRows?: number;
} & ComponentProps<"textarea">;

export const VariableTextArea: React.VFC<Props> = ({
  minRows,
  ...textAreaProps
}) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const changeHeight = (element: HTMLTextAreaElement) => {
    //scrollHeightにコンテンツが収まる最小の高さを計算させるためにheightを一旦autoにする
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (args) => {
    changeHeight(args.target);
    textAreaProps.onChange?.(args);
  };

  useLayoutEffect(() => {
    if (ref.current) {
      changeHeight(ref.current);
    }
  }, []);

  return (
    <textarea
      ref={ref}
      onChange={handleChange}
      rows={minRows}
      {...textAreaProps}
    />
  );
};
