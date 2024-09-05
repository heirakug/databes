import { createCookieSessionStorage, redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import type { User } from "~/models/user.server";
import { getUserById } from "~/models/user.server";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const USER_SESSION_KEY = "userId";
const USER_ROLE_KEY = "userRole"; // ユーザーロールのキーを追加

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie") || "";
  return sessionStorage.getSession(cookie);
}

export async function getUserId(
  request: Request,
): Promise<User["id"] | undefined> {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}

export async function getUserRole(request: Request): Promise<string | undefined> {
  const session = await getSession(request);
  return session.get(USER_ROLE_KEY);
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (userId === undefined) return null;

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname,
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function requireUser(request: Request) {
  const userId = await requireUserId(request);

  const user = await getUserById(userId);
  if (user) return user;

  throw await logout(request);
}


export async function createUserSession({
  request,
  userId,
  role, // ロールを追加
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  role: string; // ロール
  remember: boolean;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  session.set(USER_ROLE_KEY, role); // ロールをセッションに保存
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7 // 7 days
          : undefined,
      }),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function requireUserWithRole(
  request: Request,
  requiredRole: string,
  redirectTo: string = "/login"
) {
  const userId = await requireUserId(request);
  const userRole = await getUserRole(request);

  if (!userRole || userRole !== requiredRole) {
    throw redirect(redirectTo);
  }

  return { userId, userRole };
}

export async function loginUserAndRedirect({
  request,
  userId,
  role,
  remember,
}: {
  request: Request;
  userId: string;
  role: string;
  remember: boolean;
}) {
  const redirectTo = role === "admin" ? "/admin/dashboard" : "/dashboard";
  return createUserSession({ request, userId, role, remember, redirectTo });
}