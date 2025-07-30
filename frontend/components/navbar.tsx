"use client"

import { logout } from "@/api/auth"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import useAuthStore from "@/store/useAuthStore"
import { useMutation } from "@tanstack/react-query"
import { BookOpen, LogIn, Menu, User, X } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export default function Navbar({ authenticated }: {
  authenticated: boolean
}) {
  const logoutFn = useAuthStore((state) => state.logout);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      logoutFn();
      window.location.href = "/auth/login";
      window.location.reload;
    },
    onError: (error) => {
      console.error("Logout failed:", error)
    },
  })

  console.log("authenticated", authenticated)

  // This would come from your auth context in a real app
  const [isAdmin, setIsAdmin] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Books", href: "/books" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About", href: "/about" },
  ]

  const userLinks = authenticated
    ? [
      { name: "My Dashboard", href: "/dashboard" },
      { name: "My Books", href: "/dashboard" },
      { name: "Swap Requests", href: "/dashboard" },
      ...(isAdmin ? [{ name: "Admin Panel", href: "/admin" }] : []),
      { name: "Logout", href: "#" },
    ]
    : [
      { name: "Login", href: "/auth/login" },
      { name: "Sign Up", href: "/auth/signup" },
    ]

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-amber-700" />
          <span className="text-xl font-bold text-amber-900">BookSwap</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-amber-700",
                    pathname === link.href ? "text-amber-700" : "text-gray-600",
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex md:items-center md:space-x-2">
          {authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {userLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} onClick={() => {
                      if (link.name.toLowerCase() === "logout") {
                        logoutMutation.mutate()
                      } else {
                        setIsMenuOpen(false)
                      }
                    }}>{link.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/auth/login" className="flex items-center space-x-1">
                  <LogIn className="mr-1 h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
              <Button asChild className="bg-amber-700 hover:bg-amber-800">
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex items-center md:hidden"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="h-6 w-6 text-amber-900" /> : <Menu className="h-6 w-6 text-amber-900" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute left-0 right-0 top-16 z-50 bg-white p-4 shadow-md md:hidden">
          <nav className="flex flex-col space-y-4">
            <ul className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={cn(
                      "block py-2 text-sm font-medium transition-colors hover:text-amber-700",
                      pathname === link.href ? "text-amber-700" : "text-gray-600",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <hr className="border-gray-200" />
            <ul className="flex flex-col space-y-2">
              {userLinks.map((link) => (
                <li key={link.name}

                >
                  <Link
                    href={link.href}
                    className="block py-2 text-sm font-medium text-gray-600 transition-colors hover:text-amber-700"
                    onClick={() => {
                      alert(link.name.toLowerCase())
                      if (link.name.toLowerCase() === "logout") {
                        alert("Hi")
                        logoutMutation.mutate()
                      } else {
                        setIsMenuOpen(false)
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
