import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Pristine Pool Chemical Club",
  description: "Monthly pool chemical memberships. Chemical allowance only — no pool service.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
