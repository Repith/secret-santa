import { useQuery } from "@tanstack/react-query";
import { AdminStats } from "../../../../src/lib/types";

export function useAdminStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async (): Promise<AdminStats> => {
      const response = await fetch("/api/admin/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
  });
}
