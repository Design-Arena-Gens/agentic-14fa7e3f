import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "College Agent",
  description: "Interactive guide to programs, campus life, and admissions"
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;
