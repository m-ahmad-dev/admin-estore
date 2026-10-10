import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCustomer, updateCustomerStatus } from "../api/customers.api.js";

import { customerKeys } from "./useCustomers.js";

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, data }) => updateCustomer(customerId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.customerId),
      });
    },
  });
};

export const useUpdateCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, status }) =>
      updateCustomerStatus(customerId, status),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.customerId),
      });
    },
  });
};
