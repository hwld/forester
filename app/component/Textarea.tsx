import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";

export type TextareaProps = {
  isError?: boolean;
  canResize?: boolean;
  // VariableTextAreaでは、内容に合わせて高さを自動で変更するのだが、このときにborderが含まれているとスクロールバーが
  // 表示される。これは、自動調節にscrollHeightを使用していて、これがボーダーの高さを含めないことが原因なのだが、
  // 解決策が思い浮かばないのでこのpropを使用してスクロールバーを表示しなくする。
  overflowHidden?: boolean;
} & Omit<ComponentPropsWithoutRef<"textarea">, "className">;

const baseClass =
  "py-2 px-3 border transition-shadow border-gray-300 rounded-md w-full focus:outline-none focus:ring-2";
const errorClass = `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-500`;
const normalClass = `${baseClass} focus:border-emerald-400 focus:ring-emerald-400`;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { isError, canResize = true, overflowHidden = false, ...props },
    ref
  ) {
    return (
      <textarea
        ref={ref}
        {...props}
        className={`${isError ? errorClass : normalClass} ${
          !canResize ? "resize-none" : ""
        } ${overflowHidden ? "overflow-hidden" : ""}`}
      />
    );
  }
);
