"use client";

import { useState, useEffect } from "react";
import { StatCard } from "./StatCard";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

export default function ClientDashboard() {
  const [loading, setLoading] = useState(true);

  // Temporary: Using mock data until backend is ready
  useEffect(() => {
    setLoading(false);
  }, []);

  // Always use mock data for now (until backend is ready)
  const mockTransactions = [
    {
      id: "1",
      amount: 25.5,
      description: "Snacks for club meeting",
      category: { name: "Snacks", slug: "snacks", icon: "snack" },
      created_at: "2026-03-25T10:00:00Z",
      merchant: "Costco",
      status: "approved",
    },
    {
      id: "2",
      amount: 150,
      description: "Activity supplies",
      category: { name: "Activities", slug: "activities", icon: "activity" },
      created_at: "2026-03-24T14:30:00Z",
      merchant: "Office Depot",
      status: "pending",
    },
    {
      id: "3",
      amount: 45,
      description: "Prize for competition",
      category: { name: "Prizes", slug: "prizes", icon: "prize" },
      created_at: "2026-03-23T16:45:00Z",
      merchant: "Amazon",
      status: "approved",
    },
  ];

  const displayTransactions = mockTransactions;

  const totalSpent = displayTransactions.reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = displayTransactions.filter((t) => t.status === "pending").length;
  const approvedCount = displayTransactions.filter((t) => t.status === "approved").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Manage your club&apos;s finances</p>
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
          value={pendingCount.toString()}
          trend={pendingCount > 0 ? `${pendingCount} pending` : "All clear"}
          trendUp={pendingCount === 0}
        />
        <StatCard
          label="Approved Transactions"
          value={approvedCount.toString()}
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
          <TransactionList transactions={displayTransactions} />
        </div>
      </div>
    </div>
  );
}
