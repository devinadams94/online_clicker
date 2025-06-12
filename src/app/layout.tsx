import '@/styles/globals.css';
import '@/lib/setup'; // Initialize global settings
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Paperclip Clicker Game',
  description: 'A simple clicker game about making paperclips',
  icons: [
    { rel: 'icon', url: '/assets/favicon.png' },
    { rel: 'icon', url: '/favicon.ico' },
    { rel: 'apple-touch-icon', url: '/assets/apple-touch-icon.png' },
    { rel: 'shortcut icon', url: '/favicon.ico' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/favicon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
      </head>
      <body className="font-['MedodicaRegular',sans-serif] flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Global error handler to prevent audio context errors from crashing the app
            window.addEventListener('error', function(event) {
              if (event.error && event.error.message && event.error.message.includes('suspend')) {
                console.warn('Suppressed audio context error:', event.error);
                event.preventDefault();
              }
            });
            
            // Also catch unhandled promise rejections
            window.addEventListener('unhandledrejection', function(event) {
              if (event.reason && event.reason.message && event.reason.message.includes('suspend')) {
                console.warn('Suppressed audio context promise rejection:', event.reason);
                event.preventDefault();
              }
            });
          `
        }} />
      </body>
    </html>
  );
}
