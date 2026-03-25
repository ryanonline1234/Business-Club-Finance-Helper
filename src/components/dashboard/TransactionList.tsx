"use client";

import { CategoryBadge } from "./CategoryBadge";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: {
    name: string;
    slug: string;
    icon: string;
  };
  created_at: string;
  merchant?: string;
  status?: string;
}

export default function TransactionList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-slate-300 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-500">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                <span className="text-lg font-bold text-slate-700">
                  ${transaction.amount.toFixed(2)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-slate-900 text-lg">
                  {transaction.description}
                </h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1 flex-wrap">
                  <CategoryBadge category={transaction.category} />
                  {transaction.merchant && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600">{transaction.merchant}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
                {new Date(transaction.created_at).toLocaleDateString(undefined, { weekday: "short" })}
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {new Date(transaction.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(transaction.created_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
