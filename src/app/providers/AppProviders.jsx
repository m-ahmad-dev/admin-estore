import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import store from "../../store/store";
import queryClient from "../../lib/queryClient";
import { useAuthBootstrap } from "../../features/auth/hooks/useAuthBootstrap";

function AuthBootstrap({ children }) {
  useAuthBootstrap();

  return children;
}

function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthBootstrap>{children}</AuthBootstrap>

        <Toaster position="top-right" richColors closeButton duration={4000} />
      </QueryClientProvider>
    </Provider>
  );
}

export default AppProviders;
