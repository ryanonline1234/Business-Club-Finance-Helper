"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthErrorPage() {
  const [errorType, setErrorType] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const error = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("error")
    : null;

  if (error) {
    const msg =
      error === "Configuration"
        ? "The authentication provider is not configured correctly. Please contact an administrator."
        : error === "AccessDenied"
        ? "You do not have permission to access this page."
        : "An error occurred during authentication.";
    setErrorType(error);
    setErrorMessage(msg);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Authentication Error
          </h1>
        </div>

        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium mb-1">Error: {errorType || "Unknown"}</p>
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push("/auth/signin")}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
