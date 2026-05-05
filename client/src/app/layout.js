import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "../components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  verification: {
    google: 'noIYa5ONmL-daP_M8xOujXYuUUVr9CsNeLN94XDi4tw',
  },
  title: "Eventra - Events Worth Showing Up For",
  description: "Discover and host events worth showing up for",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-white text-black min-h-screen" style={{ margin: 0, padding: 0 }}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
