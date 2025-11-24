'use client';

import { useState, useTransition } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { HiMenu, HiX, HiGlobeAlt } from 'react-icons/hi';
import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from '@/components/theme-toggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const mainLinks = [
    { name: t('home'), href: '/' },
    { name: t('company'), href: '/entreprise' },
    { name: t('pricing'), href: '/payment' },
    { name: t('about'), href: '/about' },
    { name: t('contact'), href: '/contact' },
  ];

  const authLinks = [
    { name: 'Login', href: '/login' },
    { name: 'Sign Up', href: '/signup' },
  ];

  const handleCloseMenu = () => setIsOpen(false);

  const onSelectChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          <div className="flex items-center space-x-6">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">OptimaCv</Link>
            <div className="hidden md:flex md:items-center md:space-x-2">
              {mainLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <Button variant="ghost">{link.name}</Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HiGlobeAlt className="h-5 w-5" />
                  <span className="sr-only">Switch language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSelectChange('en')} disabled={isPending}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelectChange('fr')} disabled={isPending}>
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelectChange('ar')} disabled={isPending}>
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {authLinks.map((link) => (
              <Link key={link.name} href={link.href}>
                <Button variant={link.href === '/signup' ? 'default' : 'ghost'}>{link.name}</Button>
              </Link>
            ))}
          </div>


          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HiGlobeAlt className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSelectChange('en')}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelectChange('fr')}>Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelectChange('ar')}>العربية</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              <span className="sr-only">Open menu</span>
              {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>


      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {mainLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={handleCloseMenu}>
                <Button variant="ghost" className="w-full justify-start">{link.name}</Button>
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3 px-4 space-y-2">
            {authLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={handleCloseMenu}>
                <Button variant={link.href === '/signup' ? 'default' : 'outline'} className="w-full">
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
