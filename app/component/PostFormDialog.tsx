import { Dialog } from "@headlessui/react";
import { useRef } from "react";
import { MdOutlineClose } from "react-icons/md";
import type { User } from "~/models/user";
import { PostForm } from "./PostForm/PostForm";
import { UserIcon } from "./UserIcon";

type Props = {
  user: User;
  isOpen: boolean;
  close: () => void;
  replySourceId?: string;
};

export const PostFormDialog: React.VFC<Props> = ({
  user,
  isOpen,
  close,
  replySourceId,
}) => {
  const ref = useRef<HTMLDialogElement | null>(null);

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      className="relative z-50"
      initialFocus={ref}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true"></div>
      <div className="fixed inset-0 flex items-center justify-center py-4 px-5 ">
        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-slate-200 flex flex-col items-stretch px-3 pt-3">
          <div className="flex items-center">
            <button onClick={close}>
              <MdOutlineClose className="w-8 h-8" />
            </button>
          </div>
          <div className="flex mt-3 mx-3">
            <UserIcon src={user.iconUrl} />
            <div className="flex-grow">
              <PostForm onSuccess={close} replySourceId={replySourceId} />
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
