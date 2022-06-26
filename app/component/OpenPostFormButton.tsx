import { Dialog } from "@headlessui/react";
import { useRef, useState } from "react";
import { MdOutlineClose } from "react-icons/md";
import { IconButton } from "./IconButton";
import { PostForm } from "./PostForm/PostForm";

type Props = {};

export const OpenPostFormButton: React.VFC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLButtonElement | null>(null);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

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
          <Dialog.Panel className="w-full max-w-lg rounded-xl bg-slate-200 flex flex-col items-stretch p-3">
            <div className="flex items-center">
              <button onClick={close}>
                <MdOutlineClose className="w-8 h-8" />
              </button>
            </div>
            <div className="flex mt-3 mx-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500"></div>
              <div className="flex-grow">
                <PostForm onSuccess={close} />
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
