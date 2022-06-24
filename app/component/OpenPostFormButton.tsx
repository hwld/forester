import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { IconButton } from "./IconButton";

type Props = {};

export const OpenPostFormButton: React.VFC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <>
      <IconButton icon="✒" text="投稿する" textBold onClick={open} />
      <Dialog open={isOpen} onClose={close} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true"></div>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-sm rounded bg-white">
            <Dialog.Title>Title</Dialog.Title>
            <Dialog.Description>Description</Dialog.Description>
            <p>hello</p>
            <button onClick={close}>投稿</button>
            <button onClick={close}>キャンセル</button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};
