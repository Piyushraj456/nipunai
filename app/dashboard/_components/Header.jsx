'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from "next/link";
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { Menu, X } from 'lucide-react'

// Dynamically import Clerk's UserButton to avoid hydration error
const RUserButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.UserButton), {
  ssr: false,
})

const Header = () => {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Upgrade', href: '/dashboard/upgrade' },
    { label: 'Questions', href: '/dashboard/questions' },
    { label: 'How it Works', href: '/dashboard/how-it-works' },
  ]

  const isActive = (href) => pathname === href

  return (
    <header className="flex items-center justify-between p-4 bg-secondary shadow-md relative">
      {/* Logo */}
      <Link href="/dashboard">
  <Image
    src="/logo.svg"
    width={160}
    height={100}
    alt="logo"
    className="cursor-pointer"
  />
</Link>

  
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen((prev) => !prev)}
        className="md:hidden z-20"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* User Button - Desktop */}
      <div className="hidden md:block">
        <RUserButton
          appearance={{
            elements: {
              userButtonAvatarBox: {
                width: '3rem',
                height: '3rem',
              },
            },
          }}
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-6 transition-transform duration-300 ease-in-out z-10 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col gap-4 mt-16">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-lg font-medium hover:text-purple-500 ${
                isActive(link.href) ? 'text-purple-600 font-bold' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-6">
            <RUserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: {
                    width: '3rem',
                    height: '3rem',
                  },
                },
              }}
            />
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
