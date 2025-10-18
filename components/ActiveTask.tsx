import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TimerMode, type Task } from '../types';
import { MODE_COLORS } from '../constants';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { SkipIcon } from './icons/SkipIcon';
import { FocusIcon } from './icons/FocusIcon';
import { useLocalization } from '../App';

interface FocusViewProps {
    mode: TimerMode;
    setMode: (mode: TimerMode) => void;
    time: number;
    onComplete: () => void;
    onSkip: () => void;
    tasks: Task[];
    activeTaskId: string | null;
    onToggle: (id: string) => void;
    nextMode: TimerMode;
}

const FocusView: React.FC<FocusViewProps> = ({
    mode,
    setMode,
    time,
    onComplete,
    onSkip,
    tasks,
    activeTaskId,
    onToggle,
    nextMode,
}) => {
    const [timeLeft, setTimeLeft] = useState(time);
    const [isActive, setIsActive] = useState(false);
    const { t } = useLocalization();
    const isInitialMount = useRef(true);

    useEffect(() => {
        setTimeLeft(time);
        if (isInitialMount.current) {
            isInitialMount.current = false;
            setIsActive(false);
        } else {
            setIsActive(true);
        }
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
    const nextModeText = t(`timer.${nextMode}`);

    const activeTask = useMemo(() => {
        if (!activeTaskId) return null;
        return tasks.find(task => task.id === activeTaskId);
    }, [activeTaskId, tasks]);

    const progressPercentage = activeTask && activeTask.estimatedPomodoros > 0
        ? (activeTask.pomodoros / activeTask.estimatedPomodoros) * 100
        : 0;

    return (
        <div className="flex flex-col items-center p-4 sm:p-6 bg-surface dark:bg-surface-dark rounded-xl shadow-lg h-full">
            <div className="relative w-56 h-56 sm:w-72 sm:h-72">
                <svg className="w-full h-full" viewBox="0 0 300 300" aria-hidden="true">
                    <circle cx="150" cy="150" r="144" strokeWidth="12" className="stroke-current text-surface-variant/50 dark:text-surface-variant-dark/20" fill="none" />
                    <circle
                        cx="150" cy="150" r="144" strokeWidth="12" fill="none"
                        className={`stroke-current ${colors.primary} transition-all duration-1000`}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 150 150)"
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col justify-center items-center" role="timer" aria-live="polite">
                    <span className="text-5xl sm:text-7xl font-bold tracking-tighter text-on-surface dark:text-on-surface-dark">
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                </div>
            </div>

            <div className="text-center my-1 h-6">
                <span className="text-base font-medium text-on-surface-variant dark:text-on-surface-variant-dark">
                    {t('timer.next')}: <span className={`font-semibold ${MODE_COLORS[nextMode].primary}`}>{nextModeText}</span>
                </span>
            </div>

            <div className="flex-grow flex flex-col justify-center items-center text-center w-full my-1">
                {activeTask ? (
                    <div className="w-full px-4">
                        <p className="text-sm font-bold uppercase tracking-wider text-on-surface-variant dark:text-on-surface-variant-dark mb-1">{t('activeTask.currentFocus')}</p>
                        <p className="text-lg font-semibold text-on-surface dark:text-on-surface-dark mb-2">{activeTask.title}</p>
                        <div className="w-full h-2.5 bg-surface-variant/50 dark:bg-surface-variant-dark/50 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-primary dark:bg-primary-dark transition-all duration-300 rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                         <p className="text-sm text-on-surface-variant dark:text-on-surface-variant-dark/80 mb-3">
                            {activeTask.pomodoros} / {activeTask.estimatedPomodoros} pomos
                        </p>
                        <button
                            onClick={() => onToggle(activeTask.id)}
                            className="w-full max-w-xs mx-auto px-4 py-2 rounded-full text-on-primary-container dark:text-on-primary-container-dark bg-primary-container dark:bg-primary-container-dark hover:opacity-90 font-semibold transition-opacity shadow"
                        >
                            {t('activeTask.markAsComplete')}
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                        <div className="text-primary dark:text-primary-dark">
                           <FocusIcon />
                        </div>
                        <h3 className="text-lg font-semibold mt-4 text-on-surface-variant dark:text-on-surface-variant-dark">{t('activeTask.noTaskSelected')}</h3>
                        <p className="text-sm text-on-surface-variant/80 dark:text-on-surface-variant-dark/80 mt-1 max-w-xs">{t('activeTask.selectTaskPrompt')}</p>
                    </div>
                )}
            </div>

            <div className="w-full mt-auto">
                <div className="flex items-center justify-center w-full space-x-4">
                    <button onClick={onSkip} className="w-12 h-12 flex items-center justify-center rounded-full text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label={t('timer.ariaSkip')}>
                        <SkipIcon />
                    </button>
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`w-16 h-16 p-3 rounded-full flex items-center justify-center text-on-primary dark:text-on-primary-dark bg-primary dark:bg-primary-dark transition-all transform hover:scale-105 shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/50`}
                        aria-label={isActive ? t('timer.ariaPause') : t('timer.ariaStart')}
                    >
                        {isActive ? <PauseIcon /> : <PlayIcon />}
                    </button>
                    <button onClick={handleAddTime} className="w-12 h-12 flex items-center justify-center rounded-full text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary text-lg font-bold" aria-label={t('timer.addOneMinute')}>
                        +1
                    </button>
                </div>

                <div className="flex w-full mt-2 p-1 bg-surface-variant/30 dark:bg-surface-variant-dark/30 rounded-full overflow-hidden">
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
        </div>
    );
};

export default FocusView;
