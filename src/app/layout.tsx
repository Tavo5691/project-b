import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lista de Regalos",
  description: "Lista de regalos del baby shower",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
