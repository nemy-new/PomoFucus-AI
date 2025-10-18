import React, { useState, useEffect, useMemo } from 'react';
import { TimerMode } from '../types';
import { MODE_COLORS } from '../constants';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { SkipIcon } from './icons/SkipIcon';
import { useLocalization } from '../App';

interface TimerProps {
    mode: TimerMode;
    setMode: (mode: TimerMode) => void;
    time: number;
    onComplete: () => void;
    onSkip: () => void;
}

const Timer: React.FC<TimerProps> = ({ mode, setMode, time, onComplete, onSkip }) => {
    const [timeLeft, setTimeLeft] = useState(time);
    const [isActive, setIsActive] = useState(false);
    const { t } = useLocalization();

    useEffect(() => {
        setTimeLeft(time);
        setIsActive(false);
    }, [time, mode]);

    useEffect(() => {
        if (!isActive) return;

        if (timeLeft <= 0) {
            onComplete();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const handleAddTime = () => {
        setTimeLeft(prev => prev + 60);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = time > 0 ? (time - timeLeft) / time : 0;
    const circumference = 2 * Math.PI * 144;
    const strokeDashoffset = circumference * (1 - progress);
    
    const colors = useMemo(() => MODE_COLORS[mode], [mode]);

    return (
        <div className="flex flex-col items-center p-6 bg-surface dark:bg-surface-dark rounded-xl shadow-lg">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80">
                <svg className="w-full h-full" viewBox="0 0 300 300" aria-hidden="true">
                    <circle
                        cx="150"
                        cy="150"
                        r="144"
                        strokeWidth="12"
                        className="stroke-current text-surface-variant/50 dark:text-surface-variant-dark/20"
                        fill="none"
                    />
                    <circle
                        cx="150"
                        cy="150"
                        r="144"
                        strokeWidth="12"
                        fill="none"
                        className={`stroke-current ${colors.primary} transition-all duration-1000`}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 150 150)"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col justify-center items-center" role="timer" aria-live="polite">
                    <span className="text-7xl sm:text-8xl font-bold tracking-tighter text-on-surface dark:text-on-surface-dark">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-center w-full space-x-4 mt-8">
                 <button 
                    onClick={onSkip} 
                    className="w-12 h-12 flex items-center justify-center rounded-full text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" 
                    aria-label={t('timer.ariaSkip')}
                 >
                    <SkipIcon />
                 </button>
                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-on-primary dark:text-on-primary-dark bg-primary dark:bg-primary-dark transition-all transform hover:scale-105 shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50`}
                    aria-label={isActive ? t('timer.ariaPause') : t('timer.ariaStart')}
                >
                    {isActive ? <PauseIcon /> : <PlayIcon />}
                </button>
                 <button 
                    onClick={handleAddTime} 
                    className="w-12 h-12 flex items-center justify-center rounded-full text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-lg font-bold" 
                    aria-label={t('timer.addOneMinute')}
                 >
                    +1
                 </button>
            </div>

            <div className="flex w-full mt-8 p-1 bg-surface-variant/30 dark:bg-surface-variant-dark/30 rounded-full overflow-hidden">
                <button
                    onClick={() => setMode(TimerMode.Pomodoro)}
                    className={`w-1/3 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${mode === TimerMode.Pomodoro ? `bg-primary-container dark:bg-primary-container-dark text-on-primary-container dark:text-on-primary-container-dark shadow` : 'text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/5 dark:hover:bg-on-surface-dark/5'}`}
                >
                    {t('timer.pomodoro')}
                </button>
                <button
                    onClick={() => setMode(TimerMode.ShortBreak)}
                    className={`w-1/3 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${mode === TimerMode.ShortBreak ? `bg-tertiary-container dark:bg-tertiary-container-dark text-on-tertiary-container dark:text-on-tertiary-container-dark shadow` : 'text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/5 dark:hover:bg-on-surface-dark/5'}`}
                >
                    {t('timer.shortBreak')}
                </button>
                <button
                    onClick={() => setMode(TimerMode.LongBreak)}
                    className={`w-1/3 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${mode === TimerMode.LongBreak ? `bg-secondary-container dark:bg-secondary-container-dark text-on-secondary-container dark:text-on-secondary-container-dark shadow` : 'text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/5 dark:hover:bg-on-surface-dark/5'}`}
                >
                    {t('timer.longBreak')}
                </button>
            </div>
        </div>
    );
};

export default Timer;