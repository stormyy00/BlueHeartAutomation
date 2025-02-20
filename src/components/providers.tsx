"use client";

import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

const queryClient = new QueryClient();

const Providers = ({ children, session }: Props) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;
