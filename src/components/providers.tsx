"use client";

import { ToastContainer } from "react-toastify";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
  DehydratedState,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  session: Session | null;
  dehydratedState?: DehydratedState;
};

const Providers = ({ children, session, dehydratedState }: Props) => {
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
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <ToastContainer />
          {children}
        </HydrationBoundary>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
