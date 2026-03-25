import { TransactionList } from "@/components/dashboard/TransactionList";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getTransactions() {
  const session = await getServerSession(authOptions);
  if (!session) return [];

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/transactions`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.transactions || [];
  } catch {
    return [];
  }
}

export default async function TransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">All Transactions</h1>
        <p className="text-slate-600">View all club transactions</p>
      </div>

      <TransactionList transactions={transactions} />
    </div>
  );
}
