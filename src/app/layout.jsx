import { Inter, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TokenSync from "@/components/TokenSync";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    template: "IdeaVault | %s",
    default: "IdeaVault | Home",
  },
  description:
    "A platform to share, discover, and fund the next big startup ideas.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col w-full min-h-[calc(100vh-160px)]">
          {children}
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
        <TokenSync />
      </body>
    </html>
  );
}