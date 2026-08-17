import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "AuditFlow | Engineering Compliance", description: "Engineering Institution Audit & Compliance System" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
