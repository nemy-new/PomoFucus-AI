import React, { useMemo, useState, useEffect } from 'react';
import { useLocalization } from '../App';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { type Stats } from '../types';

interface ProgressModalProps {
    onClose: () => void;
    stats: Stats;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ onClose, stats }) => {
    const { t, language } = useLocalization();
    const [isEntering, setIsEntering] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsEntering(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsEntering(false);
        setTimeout(onClose, 200);
    };

    const { todayStats, streak, last7Days } = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const todaysData = stats[today] || { pomodoros: 0, focusMinutes: 0 };

        // Calculate Streak
        let currentStreak = 0;
        const d = new Date();
        // If today has no pomodoros, the streak check should start from yesterday.
        if (!stats[today] || stats[today].pomodoros === 0) {
            d.setDate(d.getDate() - 1);
        }

        while (true) {
            const key = d.toISOString().split('T')[0];
            if (stats[key] && stats[key].pomodoros > 0) {
                currentStreak++;
                d.setDate(d.getDate() - 1);
            } else {
                break; // End of streak
            }
        }

        // Calculate last 7 days data for chart
        const daysData = [];
        const d7 = new Date();
        for (let i = 0; i < 7; i++) {
            const key = d7.toISOString().split('T')[0];
            const dayStats = stats[key] || { pomodoros: 0, focusMinutes: 0 };
            daysData.push({
                date: key,
                dayLabel: d7.toLocaleDateString(language, { weekday: 'short' }),
                pomodoros: dayStats.pomodoros,
            });
            d7.setDate(d7.getDate() - 1);
        }
        const last7DaysData = daysData.reverse();

        return { todayStats: todaysData, streak: currentStreak, last7Days: last7DaysData };
    }, [stats, language]);

    const maxPomodoros = useMemo(() => {
        // Use 1 as a minimum to avoid division by zero for the chart bars.
        return Math.max(...last7Days.map(d => d.pomodoros), 1);
    }, [last7Days]);


    return (
        <div 
            className={`fixed inset-0 bg-scrim/50 flex justify-center items-center z-50 p-4 transition-opacity duration-200 ease-out ${isEntering ? 'opacity-100' : 'opacity-0'}`} 
            onClick={handleClose}
        >
            <div 
                className={`bg-surface dark:bg-surface-dark rounded-xl shadow-xl p-6 sm:p-6 w-full max-w-lg transition-all duration-200 ease-out ${isEntering ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-6 text-on-surface dark:text-on-surface-dark flex items-center">
                    <ChartBarIcon />
                    <span className="ml-2">{t('progress.title')}</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center">
                    <div className="p-4 bg-primary-container/50 dark:bg-primary-container-dark/50 rounded-lg">
                        <p className="text-sm font-medium text-on-primary-container dark:text-on-primary-container-dark">{t('progress.pomodoros')}</p>
                        <p className="text-3xl font-bold text-primary dark:text-primary-dark">{todayStats.pomodoros}</p>
                    </div>
                    <div className="p-4 bg-tertiary-container/50 dark:bg-tertiary-container-dark/50 rounded-lg">
                        <p className="text-sm font-medium text-on-tertiary-container dark:text-on-tertiary-container-dark">{t('progress.focusTime')}</p>
                        <p className="text-3xl font-bold text-tertiary dark:text-tertiary-dark">{todayStats.focusMinutes} <span className="text-lg font-medium">{t('progress.minutes')}</span></p>
                    </div>
                    <div className="p-4 bg-secondary-container/50 dark:bg-secondary-container-dark/50 rounded-lg">
                        <p className="text-sm font-medium text-on-secondary-container dark:text-on-secondary-container-dark">{t('progress.streak')}</p>
                        <p className="text-3xl font-bold text-secondary dark:text-secondary-dark">{streak} <span className="text-lg font-medium">{t('progress.days')}</span></p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4 text-on-surface dark:text-on-surface-dark">{t('progress.activity')}</h3>
                    <div className="flex justify-between items-end h-40 bg-surface-variant/30 dark:bg-surface-variant-dark/30 p-4 rounded-lg space-x-2">
                        {last7Days.map(day => (
                            <div key={day.date} className="flex-1 flex flex-col items-center text-center">
                                <div className="text-xs sm:text-sm font-bold text-on-surface-variant dark:text-on-surface-variant-dark">{day.pomodoros}</div>
                                <div className="h-24 w-full bg-surface-variant/80 dark:bg-surface-variant-dark/80 rounded-t-sm flex items-end mt-1 overflow-hidden">
                                     <div 
                                        className="w-full bg-primary dark:bg-primary-dark rounded-t-sm transition-all duration-500 ease-out"
                                        style={{ height: `${(day.pomodoros / maxPomodoros) * 100}%` }}
                                        title={`${day.pomodoros} pomodoros`}
                                     ></div>
                                </div>
                                <div className="text-xs text-on-surface-variant dark:text-on-surface-variant-dark mt-1">{day.dayLabel}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-primary dark:bg-primary-dark text-on-primary dark:text-on-primary-dark rounded-full hover:opacity-90 transition-opacity font-semibold"
                    >
                        {t('progress.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgressModal;