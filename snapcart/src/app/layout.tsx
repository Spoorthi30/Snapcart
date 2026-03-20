import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: "Snapcart",
  description: "10 minute grocery delivery app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-green-100 to-white">
        <Provider>
          <StoreProvider>
            <InitUser />
            {children}
            <Toaster position="top-right"/>
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
