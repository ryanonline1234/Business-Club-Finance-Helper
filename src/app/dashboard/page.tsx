import ClientDashboard from "@/components/dashboard/ClientDashboard";

// Disable static generation for this page
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return <ClientDashboard />;
}
