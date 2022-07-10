import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import type { AuthForm } from "./auth";
import { db } from "./db.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
// TODO: createSessionStorageを使う
const storage = createCookieSessionStorage({
  cookie: {
    name: "session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

async function createUserSession(userId: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  const setCookieHeader = await storage.commitSession(session);
  return setCookieHeader;
}

async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    return null;
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return undefined;
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      following: { select: { id: true } },
      _count: { select: { followedBy: true, following: true } },
    },
  });

  if (!user) {
    throw await logout(request);
  }

  return user;
}

export async function requireUser(request: Request) {
  const user = await getUser(request);
  if (!user) {
    throw redirect("/login");
  }

  return user;
}

export async function login({ username, password }: AuthForm) {
  const user = await db.user.findUnique({ where: { username } });
  if (!user) {
    return null;
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) {
    return null;
  }

  const sessionCookie = await createUserSession(user.id);

  return { user: { id: user.id, username }, sessionCookie };
}

export async function logout(request: Request) {
  const session = await getUserSession(request);

  return redirect("/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function registerUser({ username, password }: AuthForm) {
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await db.user.create({ data: { username, passwordHash } });
  const sessionCookie = await createUserSession(user.id);

  return { userId: user.id, sessionCookie };
}
