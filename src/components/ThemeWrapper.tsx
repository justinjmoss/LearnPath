"use client";

import { ThemeProvider } from '../lib/contexts/ThemeContext';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}