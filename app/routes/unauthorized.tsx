import { Link, Form } from "@remix-run/react";
import { useUser } from "~/utils";

export default function Unauthorized() {
  const user = useUser();

  // ユーザーのロールに基づいてダッシュボードのリンクを決定
  const dashboardLink = user.role === "admin" ? "/admin/dashboard" : "/dashboard";

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Datas</Link>
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

      <main className="flex-grow">

      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16">
  <div className="px-4 py-2 bg-red-500">
    <h1 className="text-white text-2xl font-bold">アクセス権限がありません</h1>
  </div>
  <div className="p-4">
    <div className="mb-4 text-gray-600">
      <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-center">申し訳ありませんが、このページにアクセスする権限がありません。</p>
    </div>
    <div className="mt-6 text-center">
      <Link 
        to={dashboardLink} 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
      >
        ダッシュボードに戻る
      </Link>
    </div>
  </div>
</div>

      </main>
    </div>
  );
}