import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function getTransactions() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return [];
  }

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/transactions`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.transactions || [];
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const transactions = await getTransactions();

  const totalSpent = transactions.reduce(
    (sum, t) => sum + (t.amount || 0),
    0
  );
  const pending = transactions.filter((t) => t.status === "pending").length;
  const approved = transactions.filter((t) => t.status === "approved").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Manage your club's finances</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <StatCard
          label="Total Spent"
          value={`$${totalSpent.toFixed(2)}`}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          label="Pending Approvals"
          value={pending}
          trend="Needs attention"
          trendUp={false}
        />
        <StatCard
          label="Approved Transactions"
          value={approved}
          trend="All good"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction Form */}
        <div>
          <TransactionForm />
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-lg font-medium text-slate-900 mb-4">
            Recent Transactions
          </h2>
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
