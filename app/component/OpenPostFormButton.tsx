import { useDisclosure } from "~/hooks/useDisclosure";
import { IconButton } from "./IconButton";
import { PostFormDialog } from "./PostFormDialog";

type Props = {};

export const OpenPostFormDialogButton: React.VFC<Props> = () => {
  const { isOpen, open, close } = useDisclosure();

  return (
    <>
      <IconButton icon="✒" text="投稿する" textBold onClick={open} />
      <PostFormDialog isOpen={isOpen} close={close} />
    </>
  );
};
