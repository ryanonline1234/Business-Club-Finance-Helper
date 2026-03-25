"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { StatCard } from "./StatCard";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";

// Force client-side rendering
const DashboardContent = () => {
  const { data: session, status } = useSession();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions?limit=5");
        if (response.ok) {
          const data = await response.json();
          setTransactions(data.transactions || []);
        }
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [status]);

  // Mock data for development when not authenticated
  const mockTransactions = [
    {
      id: "1",
      amount: 25.50,
      description: "Snacks for club meeting",
      category: { name: "Snacks", slug: "snacks", icon: "snack" },
      created_at: "2026-03-25T10:00:00Z",
      merchant: "Costco",
    },
    {
      id: "2",
      amount: 150.00,
      description: "Activity supplies",
      category: { name: "Activities", slug: "activities", icon: "activity" },
      created_at: "2026-03-24T14:30:00Z",
      merchant: "Office Depot",
    },
  ];

  const displayTransactions = loading ? [] : transactions.length > 0 ? transactions : mockTransactions;

  const totalSpent = displayTransactions.reduce((sum, t) => sum + t.amount, 0);

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
          value="0"
          trend="All clear"
          trendUp={true}
        />
        <StatCard
          label="Approved Transactions"
          value={displayTransactions.length.toString()}
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
};

export default DashboardContent;
