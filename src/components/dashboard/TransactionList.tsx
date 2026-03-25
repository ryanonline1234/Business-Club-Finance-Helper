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
}

export default function TransactionList({
  transactions,
}: {
  transactions: Transaction[];
}) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No transactions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-slate-600">
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">
                {transaction.description}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <CategoryBadge category={transaction.category} />
                {transaction.merchant && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>{transaction.merchant}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm text-slate-500">
              {new Date(transaction.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
