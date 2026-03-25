import TransactionList from "@/components/dashboard/TransactionList";

// Mock data for development
const mockTransactions = [
  {
    id: "1",
    amount: 25.50,
    description: "Snacks for club meeting",
    category: { name: "Snacks", slug: "snacks", icon: "snack" },
    created_at: "2026-03-25T10:00:00Z",
    merchant: "Costco",
    status: "approved",
  },
  {
    id: "2",
    amount: 150.00,
    description: "Activity supplies",
    category: { name: "Activities", slug: "activities", icon: "activity" },
    created_at: "2026-03-24T14:30:00Z",
    merchant: "Office Depot",
    status: "approved",
  },
  {
    id: "3",
    amount: 45.00,
    description: "Prize for competition",
    category: { name: "Prizes", slug: "prizes", icon: "prize" },
    created_at: "2026-03-23T16:45:00Z",
    merchant: "Amazon",
    status: "pending",
  },
  {
    id: "4",
    amount: 12.99,
    description: "Printer paper",
    category: { name: "Budget", slug: "budget", icon: "budget" },
    created_at: "2026-03-22T09:15:00Z",
    merchant: "Walmart",
    status: "approved",
  },
  {
    id: "5",
    amount: 8.50,
    description: "Coffee for meeting",
    category: { name: "Snacks", slug: "snacks", icon: "snack" },
    created_at: "2026-03-21T11:30:00Z",
    merchant: "Starbucks",
    status: "approved",
  },
];

export default function TransactionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">All Transactions</h1>
        <p className="text-slate-600 mt-1">View all club transactions and their status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Total Spent</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            ${mockTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Pending</p>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {mockTransactions.filter((t) => t.status === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-600">Approved</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {mockTransactions.filter((t) => t.status === "approved").length}
          </p>
        </div>
      </div>

      <TransactionList transactions={mockTransactions} />
    </div>
  );
}
