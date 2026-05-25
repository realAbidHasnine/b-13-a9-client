"use client";

import Link from "next/link";
import { useSession, signOut } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { Lightbulb, Menu, X, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home", public: true },
    { href: "/ideas", label: "Ideas", public: true },
    { href: "/add-idea", label: "Add Idea", public: false },
    { href: "/my-ideas", label: "My Ideas", public: false },
    { href: "/my-interactions", label: "My Interactions", public: false },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
            <Lightbulb size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">
            Idea<span className="text-zinc-500 dark:text-zinc-400">Vault</span>
          </span>
        </Link>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            if (!link.public && !user) return null;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 relative ${
                  isActive ? "text-indigo-600 dark:text-indigo-400 font-semibold" : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-5 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Auth Area & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 group hover:bg-zinc-100 dark:hover:bg-zinc-800 p-1.5 rounded-full transition-colors"
              >
                {user.photoURL || user.image ? (
                  <Image
                    src={user.photoURL || user.image}
                    alt={user.name || "Profile"}
                    width={32}
                    height={32}
                    className="rounded-full border border-zinc-200 dark:border-zinc-700 object-cover h-8 w-8"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-sm font-medium hidden sm:block max-w-25 truncate">{user.name}</span>
                <ChevronDown size={16} className={`text-zinc-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg py-2 flex flex-col z-50">
                  <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Profile Management
                  </Link>
                  <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1"></div>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      signOut();
                    }}
                    className="px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors w-full"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-black dark:text-zinc-300 dark:hover:text-white transition-colors px-3 py-2">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 text-zinc-500 hover:text-black dark:hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            if (!link.public && !user) return null;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {!user && (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col gap-2 mt-4 sm:hidden">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-outline w-full">
                Login
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full">
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}