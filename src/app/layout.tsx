import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finance App",
  description: "Modern finance mobile app built with Next.js",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning style={{background: 'var(--background)', color: 'var(--foreground)'}}>
        <div className="min-h-screen" style={{background: 'var(--background)'}}>
          {children}
        </div>
      </body>
    </html>
  );
}
