import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useOptionalUser } from "~/utils";

import { prisma } from "~/db.server";


export const loader = async () => {
  console.log("Admin dashboard loader called");

  // SQLiteのテーブル名を取得
  const tables = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`;
  
  // 除外したいテーブル名をフィルタリング
  const filteredTables = tables.filter((table: { name: string }) => 
    !["_prisma_migrations", "User", "Password"].includes(table.name)
  );

  return json({ tables: filteredTables });
}

export default function AdminDashboard() {
  console.log("Admin Dashboard component rendered");
  const { tables } = useLoaderData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
  <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">テーブル一覧</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {tables.map((table: { name: string }, index: number) => (
      <a
        href="/admin/notes"
        key={index}
        className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition duration-300 ease-in-out"
      >
        <div className="flex items-center justify-between">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            {table.name}
          </h5>
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
        <p className="font-normal text-gray-700">テーブルの詳細を表示</p>
      </a>
    ))}
  </div>
</div>
  );
}