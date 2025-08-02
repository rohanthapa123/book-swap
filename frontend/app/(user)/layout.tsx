import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { getSessionContext } from "@/lib/serverContext"
import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "BookSwap - Exchange Books with Fellow Readers",
  description: "A platform for book lovers to swap books with each other",
  generator: 'v0.dev'
}

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const { authenticated, user } = await getSessionContext();


  console.log(authenticated, user, "server")

  return (


    <div className="flex min-h-screen flex-col">
      <Navbar authenticated={authenticated} user={user?.data} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>


  )
}
