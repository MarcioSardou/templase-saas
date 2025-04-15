import { handleAuth } from "@/app/actions/handle.auth";
import { auth } from "@/app/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Dashboard() {
  const session = await auth();

  if (!session) redirect("/login");

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">PROTECTED DASHBOARD</h1>
      <p>{session?.user?.email ? session?.user?.email : "nao logado"}</p>

      {session.user?.email && (
        <form action={handleAuth}>
          <button className="cursor-pointer" type="submit">
            Logout
          </button>
        </form>
      )}
    </div>
  );
}
