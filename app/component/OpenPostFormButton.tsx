import { RiPencilLine } from "react-icons/ri";
import { useDisclosure } from "~/hooks/useDisclosure";
import type { User } from "~/models/user";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";
import { PostFormDialog } from "./PostFormDialog";

type Props = { user: User };

export const OpenPostFormDialogButton: React.VFC<Props> = ({ user }) => {
  const { isOpen, open, close } = useDisclosure();

  return (
    <>
      <div className="lg:hidden">
        <IconButton icon={<Icon icon={RiPencilLine} />} onClick={open} />
      </div>
      <div className="hidden lg:block w-full">
        <Button fullRounded fullWidth onClick={open}>
          <Icon icon={RiPencilLine} />
          <p className="ml-1 text-lg">投稿する</p>
        </Button>
      </div>
      <PostFormDialog isOpen={isOpen} close={close} user={user} />
    </>
  );
};
