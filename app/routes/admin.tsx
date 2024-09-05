import { Outlet } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { Link, Form } from "@remix-run/react";

import { requireUser } from "~/session.server";
import { useOptionalUser } from "~/utils";

export const loader = async ({ request }: { request: Request }) => {
  const user = await requireUser(request);

  if (!user) {
    // ユーザーが認証されていない場合はリダイレクト
    return redirect("/login");
  }

  // ユーザーが 'user' ロールの場合は、dashboard を表示
if (user.role !== "admin") {
  // ロールが一致しない場合は、適切なリダイレクト先へ
  return redirect("/unauthorized"); // 例: アクセス権がないページ
}

return json({ user });

};

export default function Admin() {
  const { user, role } = useOptionalUser();
  
  return (

    <div className="flex h-full min-h-screen flex-col">
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
      <h1 className="text-3xl font-bold">
        <Link to="/admin/dashboard">管理者画面</Link>
      </h1>
      <p>{user.email}</p>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
        >
          Logout
        </button>
      </Form>
    </header>

      <Outlet />
    </div>
  );
}