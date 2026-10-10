import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCountryStatus } from "../api/countries.api";
import { toast } from "sonner";

export const useToggleCountryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCountryStatus,
    onSuccess: (data) => {
      toast.success(data.message || "Country status updated");
      // Invalidate the countries list to refetch
      queryClient.invalidateQueries({ queryKey: ["countries"] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update status";
      toast.error(message);
    },
  });
};
