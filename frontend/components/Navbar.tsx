'use client';

import { useState, useTransition, useMemo } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/routing';
import { Menu, X, Globe, LogOut, User, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations, useLocale } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/components/providers/AuthProvider';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Navbar');
  const tAuth = useTranslations('AuthPage');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { isAuthenticated, user, signOut } = useAuth();

  // Define navigation links based on authentication state
  const navigationLinks = useMemo(() => {
    const publicLinks = [
      { name: t('home'), href: '/', showAlways: true },
      { name: t('pricing'), href: '/payment', showAlways: true },
      { name: t('about'), href: '/about', showAlways: true },
      { name: t('contact'), href: '/contact', showAlways: true },
    ];

    const authenticatedLinks = [
      { name: t('analyze'), href: '/CV_analyze', showAlways: false },
      { name: t('company'), href: '/entreprise', showAlways: true },
      { name: t('build'), href: '/build-cv', showAlways: true },
    ];

    if (isAuthenticated) {
      return [...publicLinks, ...authenticatedLinks];
    }
    return publicLinks;
  }, [isAuthenticated, t]);

  const handleCloseMenu = () => setIsOpen(false);

  const onSelectChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
    handleCloseMenu();
  };

  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                OptimaCv
              </span>
            </Link>

            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {navigationLinks.map((link) => (
                <Link key={link.name} href={link.href}>
                  <Button
                    variant={isActivePath(link.href) ? "secondary" : "ghost"}
                    className={isActivePath(link.href)
                      ? "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                      : ""
                    }
                  >
                    {link.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">{t('switchLanguage') || 'Switch language'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onSelectChange('en')}
                  disabled={isPending}
                  className={locale === 'en' ? 'bg-blue-50 dark:bg-blue-950' : ''}
                >
                  🇬🇧 English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSelectChange('fr')}
                  disabled={isPending}
                  className={locale === 'fr' ? 'bg-blue-50 dark:bg-blue-950' : ''}
                >
                  🇫🇷 Français
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onSelectChange('ar')}
                  disabled={isPending}
                  className={locale === 'ar' ? 'bg-blue-50 dark:bg-blue-950' : ''}
                >
                  🇸🇦 العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">{tAuth('profile')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(`/dashboard`)}>
                    <BarChart className="mr-2 h-4 w-4" />
                    {t('dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {tAuth('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost">{tAuth('login.submit')}</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="default">
                    {tAuth('register.submit')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onSelectChange('en')}>🇬🇧 English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelectChange('fr')}>🇫🇷 Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSelectChange('ar')}>🇸🇦 العربية</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-2 duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={handleCloseMenu}>
                <Button
                  variant={isActivePath(link.href) ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isActivePath(link.href)
                    ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : ''
                    }`}
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 pb-3 px-4 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 font-semibold">
                        {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.user_metadata?.full_name || 'User'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/profile" onClick={handleCloseMenu}>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" />
                    {tAuth('profile')}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {tAuth('logout')}
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={handleCloseMenu}>
                  <Button variant="outline" className="w-full">
                    {tAuth('login.submit')}
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={handleCloseMenu}>
                  <Button className="w-full" variant="default">
                    {tAuth('register.submit')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
