import { RiChat1Line } from "react-icons/ri";
import { useDisclosure } from "~/hooks/useDisclosure";
import { PostFormDialog } from "./PostFormDialog";
import { PostItemIconButton } from "./PostItem/PostItemIconButton";

type Props = { replySourceId: string };

export const ReplyFormDialogButton: React.VFC<Props> = ({ replySourceId }) => {
  const { isOpen, open, close } = useDisclosure();

  return (
    <>
      <PostItemIconButton icon={RiChat1Line} onClick={open} />
      <PostFormDialog
        isOpen={isOpen}
        close={close}
        replySourceId={replySourceId}
      />
    </>
  );
};
