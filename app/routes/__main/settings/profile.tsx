import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import path from "path";
import { ValidatedForm, validationError } from "remix-validated-form";
import { Button } from "~/component/Button";
import { MainHeader } from "~/component/MainHeader";
import { UserIconInput } from "~/component/UserIconInput";
import { ValidatedFormInput } from "~/component/ValidatedFormInput";
import { ValidatedFormTextarea } from "~/component/ValidatedFormTextarea";
import { clientUserFormValidator } from "~/formData/user/formData";
import { serverUserFormValidator } from "~/formData/user/formData.server";
import { db } from "~/lib/db.server";
import { Auth } from "~/services/authentication.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await Auth.requireUser(request);

  return json({ user });
};

export const action = async ({ request }: ActionArgs) => {
  const user = await Auth.requireUser(request);

  const userIconsDirectory = "images/user-icons";
  const uploadDirectory = `./public/${userIconsDirectory}`;
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      directory: `${uploadDirectory}`,
      file: ({ filename }) => `${user.id}${path.extname(filename)}`,
      avoidFileConflicts: false,
    }),
    unstable_createMemoryUploadHandler()
  );
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  const validationResult = await serverUserFormValidator.validate(formData);
  if (validationResult.error) {
    return validationError(validationResult.error);
  }

  const { username, profile, icon } = validationResult.data;
  const isChangedIcon = icon.name !== "";

  // ユーザーのiconUrlに保存した画像のurlをセットする
  await db.user.update({
    where: { id: user.id },
    data: {
      username,
      profile,
      iconUrl: isChangedIcon
        ? `/${userIconsDirectory}/${icon.name}`
        : undefined,
    },
  });

  return json(null);
};

export default function ProfileSetting() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <>
      <MainHeader title="プロフィール編集" canBack />
      <div>
        <ValidatedForm
          validator={clientUserFormValidator}
          method="post"
          encType="multipart/form-data"
          className="flex flex-col h-full p-3 rounded border-b border-emerald-500"
        >
          <div className="flex gap-3">
            <div>
              <UserIconInput name="icon" defaultIconUrl={user.iconUrl} />
            </div>
            <div className="grow mt-5 space-y-2">
              <ValidatedFormInput
                label="ユーザー名"
                name="username"
                defaultValue={user.username}
              />
              <ValidatedFormTextarea
                isVariable={false}
                label="プロフィール"
                name="profile"
                rows={6}
                canResize={false}
                defaultValue={user.profile}
              />
            </div>
          </div>

          <div className="self-end mt-3">
            <Button type="submit">更新する</Button>
          </div>
        </ValidatedForm>
      </div>
    </>
  );
}
