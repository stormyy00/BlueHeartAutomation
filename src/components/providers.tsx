"use client";

import { ToastContainer } from "react-toastify";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";

import { useState } from "react";
import ProtectedPage from "./protected";

type Props = {
  children: React.ReactNode;
  dehydratedState?: DehydratedState;
};

const Providers = ({ children, dehydratedState }: Props) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 3,
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
  );
  return (
    // <ProtectedPage role={"User"}>
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <ToastContainer />
        {children}
      </HydrationBoundary>
    </QueryClientProvider>
    // </ProtectedPage>
  );
};

export default Providers;
