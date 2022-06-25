import { Dialog } from "@headlessui/react";
import { useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { IconButton } from "./IconButton";
import { VariableTextArea } from "./VariableTextArea";

type Props = {};

export const OpenPostFormButton: React.VFC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  const ref = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <IconButton icon="✒" text="投稿する" textBold onClick={open} />

      <Dialog
        open={isOpen}
        onClose={close}
        className="relative z-50"
        initialFocus={ref}
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true"></div>
        <div className="fixed inset-0 flex items-center justify-center py-4 px-5 ">
          <Dialog.Panel className="w-full max-w-lg rounded bg-slate-200 flex flex-col items-stretch p-3">
            <div className="flex items-center">
              <button onClick={close}>
                <MdOutlineClose className="w-8 h-8" />
              </button>
            </div>
            <div className="flex mt-3 mx-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500"></div>
              <div className="flex-grow flex flex-col ml-3">
                <VariableTextArea
                  className="rounded px-3 py-2 resize-none"
                  minRows={3}
                />
                <button
                  onClick={close}
                  className="mt-2 px-3 py-1 bg-emerald-500 text-white rounded self-end"
                >
                  投稿
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
