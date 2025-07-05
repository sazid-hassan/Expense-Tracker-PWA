import './globals.css';
import AppLayout from './components/AppLayout';

export const metadata = {
  title: 'Expense Tracker',
  description: 'A simple PWA expense tracker.',
  manifest: '/manifest.json',
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  )
}