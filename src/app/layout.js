import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme";
import { Toaster } from "sonner";
import Flottingshapes from "@/components/flotting-shapes";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { shadesOfPurple } from "@clerk/themes";

const inter = Inter({
  subsets: ["latin"]})

export const metadata = {
  title: "editor",
  description: "A simple image editor",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={`${inter.className}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          <ClerkProvider appearance={{
            baseTheme:shadesOfPurple
          }}>
            <ConvexClientProvider>
        <main className="bg-slate-900 min-h-screen text-white overflow-x-hidden">
          <Flottingshapes/>
          <Header/>
        <Toaster richColors/>
        {children}
        </main>
         </ConvexClientProvider>
        </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
