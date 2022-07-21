import { useRef, useState } from "react";
import { UserIcon } from "./UserIcon";

type Props = { defaultIconUrl: string };
export const UserIconInput: React.VFC<Props> = ({ defaultIconUrl }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = () => {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      return;
    }

    setUrl(URL.createObjectURL(file));
  };

  const handleLoadUserIcon = () => {
    // defaultIconではなく、createObjectURLで作成された画像が読み込まれた場合、
    // オブジェクトは必要なくなるのでメモリから開放する
    if (url) {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div
      className="group cursor-pointer hover:bg-black/5 transition rounded-lg p-3"
      onClick={handleClick}
    >
      <input
        ref={fileRef}
        type={"file"}
        name="icon"
        hidden
        onChange={handleChange}
      />
      <UserIcon
        size="lg"
        src={url ? url : defaultIconUrl}
        onLoad={handleLoadUserIcon}
      />
      <div className="text-sm text-gray-800 text-center mt-1">変更する</div>
    </div>
  );
};
