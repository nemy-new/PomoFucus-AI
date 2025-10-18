import React from 'react';
import { ListIcon } from './icons/ListIcon';
import { FocusIcon } from './icons/FocusIcon';
import { useLocalization } from '../App';

interface TabBarProps {
    activeView: 'focus' | 'tasks';
    setActiveView: (view: 'focus' | 'tasks') => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeView, setActiveView }) => {
    const { t } = useLocalization();

    const TabButton = ({
        label,
        icon,
        isActive,
        onClick,
        ariaLabel,
    }: {
        label: string;
        icon: React.ReactNode;
        isActive: boolean;
        onClick: () => void;
        ariaLabel: string;
    }) => {
        const activeIndicatorClasses = "bg-secondary-container dark:bg-secondary-container-dark";
        const activeTextClasses = "text-on-surface dark:text-on-surface-dark font-bold";
        const inactiveTextClasses = "text-on-surface-variant dark:text-on-surface-variant-dark font-medium";
        const activeIconClasses = "text-on-secondary-container dark:text-on-secondary-container-dark";
        const inactiveIconClasses = "text-on-surface-variant dark:text-on-surface-variant-dark";
        
        return (
            <button
                onClick={onClick}
                className="flex flex-1 flex-col items-center justify-center gap-1 h-full py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                aria-label={ariaLabel}
                aria-pressed={isActive}
            >
                <div className={`flex items-center justify-center w-16 h-8 rounded-full transition-colors duration-300 ease-in-out ${isActive ? activeIndicatorClasses : ''}`}>
                    <div className={`transition-colors duration-300 ease-in-out ${isActive ? activeIconClasses : inactiveIconClasses}`}>
                        {icon}
                    </div>
                </div>
                <span className={`text-xs transition-colors duration-300 ease-in-out ${isActive ? activeTextClasses : inactiveTextClasses}`}>{label}</span>
            </button>
        );
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface dark:bg-surface-dark border-t border-outline/20 dark:border-outline-dark/20" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <nav className="flex items-center justify-around h-20">
                <TabButton
                    onClick={() => setActiveView('focus')}
                    isActive={activeView === 'focus'}
                    label={t('timer.pomodoro')}
                    ariaLabel="Focus View"
                    icon={<FocusIcon />}
                />
                <TabButton
                    onClick={() => setActiveView('tasks')}
                    isActive={activeView === 'tasks'}
                    label={t('taskList.title')}
                    ariaLabel="Tasks View"
                    icon={<ListIcon />}
                />
            </nav>
        </div>
    );
};

export default TabBar;