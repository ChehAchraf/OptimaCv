'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        console.log('ThemeToggle mounted, current theme:', theme);
    }, [theme]);

    const handleClick = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        console.log('Theme toggle clicked! Changing from', theme, 'to', newTheme);
        setTheme(newTheme);
    };

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <Sun className="h-5 w-5" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            className="h-9 w-9 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-500 transition-all" />
            ) : (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-400 transition-all" />
            )}
        </Button>
    );
}
