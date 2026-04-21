"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, useState } from "react";
import { Menu, X } from "lucide-react";

// simple cn fallback (in case you don't have @/lib/utils)
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NavLink = forwardRef(function NavLink(
  { className, activeClassName, href, children, ...props },
  ref
) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      ref={ref}
      href={href}
      className={cn(className, isActive && activeClassName)}
      {...props}
    >
      {children}
    </Link>
  );
});

export function Navbar({ links = [] }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative z-50 border-b bg-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="text-xl font-black">Eventra</span>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="text-sm text-gray-500 hover:text-black transition"
              activeClassName="text-black font-semibold"
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex items-center justify-center h-9 w-9 rounded-md hover:bg-gray-100"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 pb-4 pt-2 flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className="block rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-black"
              activeClassName="bg-gray-100 text-black font-semibold"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export { NavLink };