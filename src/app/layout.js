import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WasteManChatbot from '@/components/WasteManChatbot';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'WasteWise — Turn Industrial & Household Waste into Business Opportunities',
  description:
    'Discover 240+ waste-to-business ideas and connect with waste generators and entrepreneurs near you. Building a circular economy.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-surface text-charcoal`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        {/* WasteMan AI Chatbot — appears on all pages */}
        <WasteManChatbot />
      </body>
    </html>
  );
}
