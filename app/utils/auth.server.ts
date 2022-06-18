export function validateUserName(username: unknown): string | undefined {
  if (typeof username !== "string") {
    return "無効なユーザー名です。";
  }
  if (username.length < 3) {
    return "ユーザー名は3文字以上で入力してください。";
  }
}

export function validatePassword(password: unknown): string | undefined {
  if (typeof password !== "string") {
    return "無効なユーザー名です。";
  }
  if (password.length < 6) {
    return "パスワードは6文字以上で入力してください。";
  }
}
