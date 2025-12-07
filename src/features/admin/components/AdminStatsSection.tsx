import { useAdminStats } from "../hooks/useAdminStats";
import { StatsDashboard } from "./StatsDashboard";

export function AdminStatsSection() {
  const { data: stats, isLoading } = useAdminStats();

  return <StatsDashboard stats={stats} isLoading={isLoading} />;
}
