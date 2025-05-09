"use client"

import Link from "next/link"
import { useState } from "react"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { Menu, X, Plane } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {/* <Plane className="h-6 w-6" /> */}
            <span className="text-xl font-bold">Lets Go Makkah.</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Home
          </Link>
          <Link
            href="/flights/popular"
            className={`text-sm font-medium transition-colors ${pathname.startsWith("/flights") ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Popular Flights
          </Link>
          <Link
            href="/bookings"
            className={`text-sm font-medium transition-colors ${pathname === "/bookings" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            My Bookings
          </Link>
          <Link
            href="/wallet"
            className={`text-sm font-medium transition-colors ${pathname === "/wallet" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Wallet
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button variant="outline" size="sm" asChild className="hidden md:flex">
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild className="hidden md:flex">
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="container md:hidden py-4 pb-6">
          <nav className="flex flex-col gap-4">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-foreground" : "text-muted-foreground"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/flights/popular"
              className={`text-sm font-medium transition-colors ${pathname.startsWith("/flights") ? "text-foreground" : "text-muted-foreground"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Popular Flights
            </Link>
            <Link
              href="/bookings"
              className={`text-sm font-medium transition-colors ${pathname === "/bookings" ? "text-foreground" : "text-muted-foreground"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Bookings
            </Link>
            <Link
              href="/wallet"
              className={`text-sm font-medium transition-colors ${pathname === "/wallet" ? "text-foreground" : "text-muted-foreground"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Wallet
            </Link>
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" asChild className="flex-1">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild className="flex-1">
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
