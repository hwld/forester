import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import {
  json,
  NodeOnDiskFile,
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import path from "path";
import { Button } from "~/component/Button";
import { MainHeader } from "~/component/MainHeader";
import { UserIconInput } from "~/component/UserIconInput";
import { db } from "~/utils/db.server";
import { requireUser } from "~/utils/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  console.log("loader");
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
            <UserIconInput defaultIconUrl={user.iconUrl} />
          </div>

          <div className="self-end">
            <Button type="submit">更新する</Button>
          </div>
        </profileSettingFetcher.Form>
      </div>
    </>
  );
}
