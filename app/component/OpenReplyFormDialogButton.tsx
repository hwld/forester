import { RiChat1Line } from "react-icons/ri";
import { useDisclosure } from "~/hooks/useDisclosure";
import type { User } from "~/models/user";
import { PostFormDialog } from "./PostFormDialog";
import { PostIconButton } from "./PostItem/PostIconButton";

type Props = { user: User; replySourceId: string; size?: "md" | "lg" };

export const ReplyFormDialogButton: React.VFC<Props> = ({
  user,
  replySourceId,
  size,
}) => {
  const { isOpen, open, close } = useDisclosure();

  return (
    <>
      <PostIconButton icon={RiChat1Line} onClick={open} size={size} />
      <PostFormDialog
        isOpen={isOpen}
        close={close}
        replySourceId={replySourceId}
        user={user}
      />
    </>
  );
};
