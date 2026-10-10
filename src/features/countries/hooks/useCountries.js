import { useQuery } from "@tanstack/react-query";
import { getCountries } from "../api/countries.api";

export const useCountries = (filters = {}) => {
  return useQuery({
    queryKey: ["countries", filters],
    queryFn: () => getCountries(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
