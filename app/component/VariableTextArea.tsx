import type { ChangeEventHandler } from "react";
import { useEffect, useRef } from "react";
import type { TextareaProps } from "./Textarea";
import { Textarea } from "./Textarea";

type Props = {
  minRows?: number;
} & TextareaProps;

/**
 * 改行すると高さが変わるtextarea
 */
export const VariableTextArea: React.VFC<Props> = ({
  minRows,
  ...textAreaProps
}) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const changeHeight = (element: HTMLTextAreaElement) => {
    //scrollHeightでコンテンツが収まる最小の高さを計算させるためにheightを一旦autoにする
    element.style.height = "auto";
    element.style.height = element.scrollHeight + "px";
  };

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (args) => {
    changeHeight(args.target);
    textAreaProps.onChange?.(args);
  };

  useEffect(() => {
    // デフォルトの値が入っている場合に対応するために、
    // レンダリング時に高さを変更する
    if (ref.current) {
      changeHeight(ref.current);
    }
  }, []);

  return (
    <Textarea
      ref={ref}
      onChange={handleChange}
      rows={minRows}
      canResize={false}
      overflowHidden={true}
      {...textAreaProps}
    />
  );
};
