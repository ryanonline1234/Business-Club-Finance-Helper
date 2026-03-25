"use client";

import dynamic from "next/dynamic";

// Import server components directly since this is now a client component
import { StatCard } from "./StatCard";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

const DashboardContent = dynamic(() => Promise.resolve(() => {
  return <div>Loading...</div>;
}), {
  ssr: true,
});

export default function ClientDashboard() {
  // Client-side only component
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
          value="$175.50"
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          label="Pending Approvals"
          value="0"
          trend="All clear"
          trendUp={true}
        />
        <StatCard
          label="Approved Transactions"
          value="2"
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
          {/* Use mock data for now */}
          <TransactionList
            transactions={[
              {
                id: "1",
                amount: 25.5,
                description: "Snacks for club meeting",
                category: { name: "Snacks", slug: "snacks", icon: "snack" },
                created_at: "2026-03-25T10:00:00Z",
                merchant: "Costco",
              },
              {
                id: "2",
                amount: 150,
                description: "Activity supplies",
                category: { name: "Activities", slug: "activities", icon: "activity" },
                created_at: "2026-03-24T14:30:00Z",
                merchant: "Office Depot",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
