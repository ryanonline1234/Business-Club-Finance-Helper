import { TransactionList } from "@/components/dashboard/TransactionList";

// Mock data for development
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
  {
    id: "3",
    amount: 45.00,
    description: "Prize for competition",
    category: { name: "Prizes", slug: "prizes", icon: "prize" },
    created_at: "2026-03-23T16:45:00Z",
    merchant: "Amazon",
  },
];

export default function TransactionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">All Transactions</h1>
        <p className="text-slate-600">View all club transactions</p>
      </div>

      <TransactionList transactions={mockTransactions} />
    </div>
  );
}
