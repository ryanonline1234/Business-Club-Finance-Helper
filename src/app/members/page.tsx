import { Sidebar } from "@/components/dashboard/Sidebar";
import { Members } from "@/components/dashboard/Members";

export default function MembersPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Officer Roster</h1>
          <Members />
        </div>
      </div>
    </div>
  );
}
