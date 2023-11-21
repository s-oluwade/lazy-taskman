import Header from '@/components/Header';
import {ThemeProvider} from '@/components/theme-provider';
import {Toaster} from '@/components/ui/toaster';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Lazy Taskman',
  description: "How may I complete these darn tasks?!",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
          {/* <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange> */}
          <main className='md:container'>{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
