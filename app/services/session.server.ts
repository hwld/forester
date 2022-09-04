import { createCookieSessionStorage } from "@remix-run/node";

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

const destroy = storage.destroySession;

async function create(userId: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  const setCookieHeader = await storage.commitSession(session);
  return setCookieHeader;
}

async function get(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export const Session = {
  destroy,
  create,
  get,
} as const;
