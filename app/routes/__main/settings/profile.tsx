import type { ActionArgs } from "@remix-run/node";
import {
  json,
  NodeOnDiskFile,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import path from "path";
import { useRef } from "react";
import { MainHeader } from "~/component/MainHeader";
import { UserIcon } from "~/component/UserIcon";
import { requireUser } from "~/utils/session.server";

export const action = async ({ request }: ActionArgs) => {
  const user = await requireUser(request);

  const uploadHandler = unstable_createFileUploadHandler({
    directory: "./public/images/user-icons",
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

  return json({});
};

export default function ProfileSetting() {
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
              <UserIcon size="lg" />
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
