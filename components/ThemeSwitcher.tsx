import React, { useState, useEffect, useRef } from 'react';
import { type Theme } from '../types';
import { useLocalization } from '../App';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { DesktopIcon } from './icons/DesktopIcon';

interface ThemeSwitcherProps {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLocalization();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleThemeChange = (newTheme: Theme) => {
        setTheme(newTheme);
        setIsOpen(false);
    };

    const isSystemDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effectiveTheme = theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme;

    const ThemeIcon = () => {
        if (theme === 'light') return <SunIcon />;
        if (theme === 'dark') return <MoonIcon />;
        return <DesktopIcon />;
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                aria-label={t('theme.toggleTheme')}
            >
                <ThemeIcon />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-surface dark:bg-surface-dark rounded-md shadow-lg z-10 border border-outline/20 dark:border-outline-dark/20">
                    <ul className="py-1">
                        <li>
                            <button
                                onClick={() => handleThemeChange('light')}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${theme === 'light' ? 'bg-primary-container/50 dark:bg-primary-container-dark/50' : ''} hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10 text-on-surface dark:text-on-surface-dark`}
                            >
                                <SunIcon /> {t('theme.light')}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleThemeChange('dark')}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${theme === 'dark' ? 'bg-primary-container/50 dark:bg-primary-container-dark/50' : ''} hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10 text-on-surface dark:text-on-surface-dark`}
                            >
                                <MoonIcon /> {t('theme.dark')}
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => handleThemeChange('system')}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${theme === 'system' ? 'bg-primary-container/50 dark:bg-primary-container-dark/50' : ''} hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10 text-on-surface dark:text-on-surface-dark`}
                            >
                               <DesktopIcon /> {t('theme.system')}
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;
