import { ThemeProvider } from "@/components/theme-provider"
import AuthProvider from "@/hooks/auth-provider"
import { QueryProvider } from "@/lib/ReactQuery/ReactQueryProvider"
import { getSessionContext } from "@/lib/serverContext"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import "./globals.css"
import ClientAuthHydration from "@/components/ClientAuthHydration"

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
              <ClientAuthHydration user={authenticated ? user?.data : null} />
              {children}
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
