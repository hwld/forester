import type { ChangeEventHandler, ComponentProps } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Props = {
  minRows?: number;
} & ComponentProps<"textarea">;

export const VariableTextArea: React.VFC<Props> = ({
  minRows,
  ...textAreaProps
}) => {
  // https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
  const [show, setShow] = useState(false);
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

  useEffect(() => {
    setShow(true);
  }, []);

  useLayoutEffect(() => {
    if (ref.current) {
      changeHeight(ref.current);
    }
  }, []);

  if (!show) {
    return null;
  }

  return (
    <textarea
      ref={ref}
      onChange={handleChange}
      rows={minRows}
      {...textAreaProps}
    />
  );
};
