import { redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import type { AuthFormData } from "~/formData/authFormData";
import { db } from "~/lib/db.server";
import { findUser } from "~/models/user/finder.server";
import { Session } from "./session.server";

const authentication = async (username: string, password: string) => {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) {
    return false;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    return false;
  }

  return user.id;
};

async function getLoggedInUser(request: Request) {
  const session = await Session.get(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return undefined;
  }

  const user = await findUser({ where: { id: userId } });

  if (!user) {
    throw await logout(request);
  }

  return user;
}

async function requireUser(request: Request) {
  const user = await getLoggedInUser(request);
  if (!user) {
    throw redirect("/login");
  }

  return user;
}

async function login({ username, password }: AuthFormData) {
  const userId = await authentication(username, password);
  if (!userId) {
    return null;
  }
  const sessionCookie = await Session.create(userId);

  return { user: { id: userId, username }, sessionCookie };
}

async function logout(request: Request) {
  const session = await Session.get(request);

  return redirect("/login", {
    headers: {
      "Set-Cookie": await Session.destroy(session),
    },
  });
}

async function registerUser({ username, password }: AuthFormData) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({ data: { username, passwordHash } });
  const sessionCookie = await Session.create(user.id);

  return { userId: user.id, sessionCookie };
}

export const Auth = {
  authentication,
  getLoggedInUser,
  requireUser,
  login,
  logout,
  registerUser,
} as const;
