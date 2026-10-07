import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "PDFarrange — A little order for your PDFs",
  description:
    "Upload, arrange, split and merge your PDFs in one beautifully simple workspace.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
