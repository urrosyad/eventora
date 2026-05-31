import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Province, City, ApiResponse } from "@/types";

export function useProvinces() {
  return useQuery<Province[]>({
    queryKey: ["provinces"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Province[]>>("/location/provinces");
      return res.data.data || [];
    },
    staleTime: 1000 * 60 * 60 * 24, // cache for 1 day
  });
}

export function useCities(provinceId: string | null | undefined) {
  return useQuery<City[]>({
    queryKey: ["cities", provinceId],
    queryFn: async () => {
      if (!provinceId) return [];
      const res = await api.get<ApiResponse<City[]>>(`/location/cities/${provinceId}`);
      return res.data.data || [];
    },
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60 * 24, // cache for 1 day
  });
}
