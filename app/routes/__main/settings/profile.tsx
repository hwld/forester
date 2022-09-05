import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import {
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { UseDataFunctionReturn } from "@remix-run/react/dist/components";
import path from "path";
import { useMemo } from "react";
import { Button } from "~/component/Button";
import { FormControl } from "~/component/FormControl";
import { FormError } from "~/component/FormError";
import { MainHeader } from "~/component/MainHeader";
import { UserIconInput } from "~/component/UserIconInput";
import { validateUserForm } from "~/formData/userFormData";
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

  const validationResult = validateUserForm(formData);
  if (validationResult.type === "error") {
    return json({ type: "error", error: validationResult.error } as const);
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

  return json({ type: "success" } as const);
};

export default function ProfileSetting() {
  const { user } = useLoaderData<typeof loader>();
  const profileSettingFetcher =
    useFetcher<UseDataFunctionReturn<typeof action>>();

  const error = useMemo(() => {
    if (profileSettingFetcher.data?.type === "error") {
      return profileSettingFetcher.data.error;
    }
  }, [profileSettingFetcher]);

  return (
    <>
      <MainHeader title="プロフィール編集" canBack />
      <div>
        <profileSettingFetcher.Form
          method="post"
          encType="multipart/form-data"
          className="flex flex-col h-full p-3 rounded border-b border-emerald-500"
        >
          {error?.formError && <FormError message={error.formError} />}
          <div className="flex gap-3">
            <div>
              <UserIconInput name="icon" defaultIconUrl={user.iconUrl} />
            </div>
            <div className="grow mt-5 space-y-2">
              <FormControl
                label="ユーザー名"
                name="username"
                defaultValue={user.username}
                errors={error?.fieldErrors?.username}
              />
              <FormControl
                controlType="textarea"
                label="プロフィール"
                name="profile"
                canResize={false}
                rows={6}
                defaultValue={user.profile}
                errors={error?.fieldErrors?.profile}
              />
            </div>
          </div>

          <div className="self-end mt-3">
            <Button type="submit">更新する</Button>
          </div>
        </profileSettingFetcher.Form>
      </div>
    </>
  );
}
