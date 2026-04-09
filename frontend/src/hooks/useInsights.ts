import { useQuery } from "@tanstack/react-query";
import { fetchInsights } from "@/services/api";
import type { InsightsParams } from "@/services/api";

export function useInsights(params: InsightsParams) {
  return useQuery({
    queryKey: ["insights", params],
    queryFn: () => fetchInsights(params),
    enabled: !!params.country, // Only fetch when country is selected
  });
}
