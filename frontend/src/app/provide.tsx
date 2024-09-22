"use client";

import useLoadingStore from "@/libs/useLoading";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const { isGlobalLoading } = useLoadingStore();
  return (
    <ThemeProvider attribute="class" enableSystem={true}>
      {!isGlobalLoading && children}
    </ThemeProvider>
  );
}
