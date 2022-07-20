import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import {
  json,
  NodeOnDiskFile,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import path from "path";
import { useRef } from "react";
import { MainHeader } from "~/component/MainHeader";
import { UserIcon } from "~/component/UserIcon";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireUser(request);

  return json({ user });
};

export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser(request);

  const userIconsDirectory = "images/users-icons";
  const uploadDirectory = `./public/${userIconsDirectory}`;
  const uploadHandler = unstable_createFileUploadHandler({
    directory: `${uploadDirectory}`,
    file: ({ filename }) => `${user.id}${path.extname(filename)}`,
    avoidFileConflicts: false,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const icon = formData.get("icon");
  if (!(icon instanceof NodeOnDiskFile)) {
    return json({});
  }

  // ユーザーのiconUrlに保存した画像のurlをセットする
  await db.user.update({
    where: { id: user.id },
    data: { iconUrl: `/${userIconsDirectory}/${icon.name}` },
  });

  return json({});
};

export default function ProfileSetting() {
  const { user } = useLoaderData<typeof loader>();
  const profileSettingFetcher = useFetcher();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (!fileRef.current) {
      return;
    }

    fileRef.current.click();
  };

  return (
    <>
      <MainHeader title="プロフィール編集" canBack />
      <div>
        <profileSettingFetcher.Form
          method="post"
          encType="multipart/form-data"
          className="flex flex-col bg-emerald-200 h-full m-2 p-3 rounded"
        >
          <div className="flex">
            <div
              className="group cursor-pointer hover:bg-black/5 transition rounded-lg p-3"
              onClick={handleClick}
            >
              <input ref={fileRef} type={"file"} name="icon" hidden />
              <UserIcon size="lg" src={user.iconUrl} />
              <div className="text-sm text-gray-800 text-center mt-1">
                変更する
              </div>
            </div>
          </div>

          <button
            type={"submit"}
            className="px-3 py-2 rounded-md font-bold bg-emerald-400 hover:bg-emerald-500 transition self-end text-gray-800"
          >
            更新する
          </button>
        </profileSettingFetcher.Form>
      </div>
    </>
  );
}
