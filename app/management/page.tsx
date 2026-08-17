import { AppShell } from "@/components/app-shell"; import { ManagementDashboard } from "@/components/management-dashboard";
export default function Page() { return <AppShell><h1 className="text-2xl font-bold">Management Dashboard</h1><p className="mb-7 text-sm text-slate-500">Live institution-wide compliance insights.</p><ManagementDashboard /></AppShell>; }
