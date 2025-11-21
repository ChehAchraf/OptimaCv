'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HiMenu, HiX } from 'react-icons/hi';
import { frNavigation } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { NavItem } from '@/types/type';

const content = frNavigation;


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const mainLinks: NavItem[] = content.links;
  const authLinks: NavItem[] = [
    { name: content.loginButton, href: '/login' },
    { name: content.ctaButton, href: '/signup' },
   
  ];

  const handleCloseMenu = () => setIsOpen(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center space-x-6">
            <Link href="/" className="shrink-0">
              <span className="text-2xl font-bold text-gray-900">{content.logoText}</span>
            </Link>

            <div className="hidden md:flex md:items-center md:space-x-1">
              {mainLinks.map((link) => (
                <Button variant="ghost" asChild key={link.name}>
                  <Link href={link.href}>{link.name}</Link>
                </Button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {authLinks.map((link) => (
              <Button
                key={link.name}
                variant={link.href === '/signup' ? 'default' : 'ghost'}
                asChild
              >
                <Link href={link.href}>{link.name}</Link>
              </Button>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              <span className="sr-only">{content.openMenu}</span>
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {mainLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                asChild
                className="w-full justify-start"
              >
                <Link href={link.href} onClick={handleCloseMenu}>
                  {link.name}
                </Link>
              </Button>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3 px-4 space-y-3">
            {authLinks.map((link) => (
              <Button
                key={link.name}
                variant={link.href === '/signup' ? 'default' : 'outline'}
                asChild
                className="w-full"
              >
                <Link href={link.href} onClick={handleCloseMenu}>
                  {link.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

