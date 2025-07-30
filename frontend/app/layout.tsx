import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { QueryProvider } from "@/lib/ReactQuery/ReactQueryProvider"
import { getSessionContext } from "@/lib/serverContext"
import AuthProvider from "@/hooks/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BookSwap - Exchange Books with Fellow Readers",
  description: "A platform for book lovers to swap books with each other",
  generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const { authenticated, user } = await getSessionContext();


  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider user={user?.data}>

            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>

              <div className="flex min-h-screen flex-col">
                <Navbar authenticated={authenticated} />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>

            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
