"use client";

import { signOut, useSession } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md"
      >
        Sign Out
      </button>
    );
  }

  return (
    <a
      href="/api/auth/signin"
      className="text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md"
    >
      Sign In
    </a>
  );
}
