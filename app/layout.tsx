import './globals.css';

export const metadata = {
  title: 'Northern Beaches Roof Restoration',
  description: 'Coastal-grade roof restoration pages generated from Supabase.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
