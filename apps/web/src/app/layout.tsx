import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SiteBrain AI | Construction Intelligence Platform',
  description: 'Enterprise AI operating system for construction management, safety, and digital twin analytics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
