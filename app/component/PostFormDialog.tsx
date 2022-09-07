import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef } from "react";
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog onClose={close} className="relative z-50" initialFocus={ref}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true"></div>
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center py-4 px-5 ">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-250"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-lg rounded-lg bg-slate-200 flex flex-col items-stretch p-1 transition-all">
              <div className="flex items-center">
                <button onClick={close}>
                  <MdOutlineClose className="w-8 h-8" />
                </button>
              </div>
              <div className="flex mt-1 mx-3">
                <UserIcon src={user.iconUrl} />
                <div className="flex-grow">
                  <PostForm onSuccess={close} replySourceId={replySourceId} />
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
