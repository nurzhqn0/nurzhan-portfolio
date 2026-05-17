import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "nurzhqn0",
  description:
    "Portfolio of nurzhqn0, a software engineer building modern web applications and backend services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
