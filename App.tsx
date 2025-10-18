import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TaskList from './components/TaskList';
import SettingsModal from './components/SettingsModal';
import useLocalStorage from './hooks/useLocalStorage';
import { type Task, TimerMode, type Settings, type Theme, type Stats } from './types';
import { translations, THEMES } from './constants';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { ChartBarIcon } from './components/icons/ChartBarIcon';
import ProgressModal from './components/ProgressModal';
import { prioritizeTasks } from './services/geminiService';
import FocusView from './components/ActiveTask';
import EditTaskModal from './components/EditTaskModal';
import AddTaskModal from './components/AddTaskModal';
import ThemeSwitcher from './components/ThemeSwitcher';
import TabBar from './components/TabBar';

// Localization Context
interface LocalizationContextType {
    t: (key: string, params?: { [key: string]: string | number }) => string;
    language: 'en' | 'ja';
    setLanguage: (lang: 'en' | 'ja') => void;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);
export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};

const App: React.FC = () => {
    // State management
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
    const [settings, setSettings] = useLocalStorage<Settings>('settings', {
        pomodoroTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
        longBreakInterval: 4,
        language: 'ja',
        notificationsEnabled: false,
        themeName: 'default',
        apiKey: '',
    });
    const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');
    const [mode, setMode] = useState<TimerMode>(TimerMode.Pomodoro);
    const [pomodorosInCycle, setPomodorosInCycle] = useState(0);
    const [activeTaskId, setActiveTaskId] = useLocalStorage<string | null>('activeTaskId', null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isProgressOpen, setIsProgressOpen] = useState(false);
    const [stats, setStats] = useLocalStorage<Stats>('stats', {});
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [activeView, setActiveView] = useState<'focus' | 'tasks'>('focus');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    // Localization setup
    const t = useCallback((key: string, params?: { [key:string]: string | number }) => {
        const lang = translations[settings.language];
        const keys = key.split('.');
        let result: any = lang;
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) return key;
        }
        if (typeof result === 'string' && params) {
            return Object.entries(params).reduce(
                (acc, [paramKey, paramValue]) => acc.replace(`{{${paramKey}}}`, String(paramValue)),
                result
            );
        }
        return result || key;
    }, [settings.language]);

    const setLanguage = (lang: 'en' | 'ja') => {
        setSettings(prev => ({ ...prev, language: lang }));
    };
    
    // Theme management
    useEffect(() => {
        const applyTheme = () => {
            if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        applyTheme();

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', applyTheme);
            return () => mediaQuery.removeEventListener('change', applyTheme);
        }
    }, [theme]);

    // Color Theme management
    useEffect(() => {
        const selectedTheme = THEMES.find(t => t.id === settings.themeName) || THEMES[0];
        const root = document.documentElement;
        
        Object.entries(selectedTheme.light).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });
        Object.entries(selectedTheme.dark).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

    }, [settings.themeName]);


    // Notification permission management
    useEffect(() => {
        if (settings.notificationsEnabled && 'Notification' in window) {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission().then(permission => {
                    if (permission !== 'granted') {
                        setSettings(prev => ({ ...prev, notificationsEnabled: false }));
                    }
                });
            }
        }
    }, [settings.notificationsEnabled, setSettings]);

    // Timer logic
    const timerDuration = useMemo(() => {
        switch (mode) {
            case TimerMode.Pomodoro:
                return settings.pomodoroTime * 60;
            case TimerMode.ShortBreak:
                return settings.shortBreakTime * 60;
            case TimerMode.LongBreak:
                return settings.longBreakTime * 60;
            default:
                return settings.pomodoroTime * 60;
        }
    }, [mode, settings]);

    const nextMode = useMemo(() => {
        if (mode === TimerMode.Pomodoro) {
            if ((pomodorosInCycle + 1) % settings.longBreakInterval === 0) {
                return TimerMode.LongBreak;
            }
            return TimerMode.ShortBreak;
        }
        return TimerMode.Pomodoro;
    }, [mode, pomodorosInCycle, settings.longBreakInterval]);

    const handleTimerComplete = useCallback(() => {
        new Audio('/bell.mp3').play().catch(e => console.error("Error playing sound:", e));

        // Determine next mode for notification
        let nextModeNotification = TimerMode.Pomodoro;
        if (mode === TimerMode.Pomodoro) {
            nextModeNotification = (pomodorosInCycle + 1) % settings.longBreakInterval === 0 
                ? TimerMode.LongBreak 
                : TimerMode.ShortBreak;
        }

        if (settings.notificationsEnabled && Notification.permission === 'granted') {
            const title = t('notifications.title');
            const bodyKey = `notifications.body.${nextModeNotification}`;
            const body = t(bodyKey as keyof typeof translations.en.notifications.body);
            
            // Using a generic icon, replace if you have a specific one
            new Notification(title, { body, icon: '/vite.svg' });
        }

        if (mode === TimerMode.Pomodoro) {
            const newPomodorosInCycle = pomodorosInCycle + 1;
            setPomodorosInCycle(newPomodorosInCycle);

            const today = new Date().toISOString().split('T')[0];
            setStats(prevStats => {
                const todayStats = prevStats[today] || { pomodoros: 0, focusMinutes: 0 };
                return {
                    ...prevStats,
                    [today]: {
                        pomodoros: todayStats.pomodoros + 1,
                        focusMinutes: todayStats.focusMinutes + settings.pomodoroTime,
                    }
                };
            });

            // Update active task
            if (activeTaskId) {
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.id === activeTaskId
                            ? { ...task, pomodoros: task.pomodoros + 1 }
                            : task
                    )
                );
            }
            setMode(nextModeNotification);
        } else {
            setMode(TimerMode.Pomodoro);
        }
    }, [settings, mode, pomodorosInCycle, activeTaskId, setTasks, setStats, t]);

    const skipTimer = () => {
        if (mode === TimerMode.Pomodoro) {
            const newPomodorosInCycle = pomodorosInCycle + 1;
            setPomodorosInCycle(newPomodorosInCycle);
             if (newPomodorosInCycle % settings.longBreakInterval === 0) {
                setMode(TimerMode.LongBreak);
            } else {
                setMode(TimerMode.ShortBreak);
            }
        } else {
             setMode(TimerMode.Pomodoro);
        }
    }

    // Task handlers
    const addTask = (title: string, estimatedPomodoros: number, eta: string) => {
        const newTask: Task = {
            id: uuidv4(),
            title,
            estimatedPomodoros,
            completed: false,
            pomodoros: 0,
            eta: eta || undefined,
        };
        setTasks(prev => [...prev, newTask]);
    };
    
    const editTask = (id: string, updates: { title: string; estimatedPomodoros: number; eta: string; }) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, ...updates, eta: updates.eta || undefined } : task
            )
        );
    };

    const addTasks = (newTasks: Omit<Task, 'id' | 'completed' | 'pomodoros'>[]) => {
        const tasksToAdd: Task[] = newTasks.map(t => ({
            id: uuidv4(),
            ...t,
            completed: false,
            pomodoros: 0,
        }));
        setTasks(prev => [...prev, ...tasksToAdd]);
    };

    const toggleTask = (id: string) => {
        const taskToToggle = tasks.find(task => task.id === id);
        
        // If the task being marked as complete is the currently active task, clear the active task.
        if (taskToToggle && !taskToToggle.completed && id === activeTaskId) {
            setActiveTaskId(null);
        }

        setTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id));
        if(activeTaskId === id) {
            setActiveTaskId(null);
        }
    };
    
    const reorderTasks = (sourceIndex: number, destinationIndex: number) => {
        setTasks(prevTasks => {
            const uncompleted = prevTasks.filter(task => !task.completed);
            const completed = prevTasks.filter(task => task.completed);
            const [removed] = uncompleted.splice(sourceIndex, 1);
            uncompleted.splice(destinationIndex, 0, removed);
            return [...uncompleted, ...completed];
        });
    };
    
    const handlePrioritizeTasks = useCallback(async () => {
        if (!settings.apiKey) {
            alert(t('gemini.apiKeyError'));
            return;
        }
        const uncompleted = tasks.filter(t => !t.completed);
        if (uncompleted.length <= 1) return;

        try {
            const sortedIds = await prioritizeTasks(settings.apiKey, uncompleted, settings.language);
            const completed = tasks.filter(t => t.completed);
            
            const taskMap = new Map(tasks.map(t => [t.id, t]));
            const sortedUncompleted = sortedIds.map(id => taskMap.get(id)).filter(Boolean) as Task[];
            
            if (sortedUncompleted.length !== uncompleted.length) {
               console.error("Task prioritization resulted in mismatched tasks. Aborting reorder.");
               return;
            }

            setTasks([...sortedUncompleted, ...completed]);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : String(error));
        }
    }, [tasks, settings.apiKey, settings.language, setTasks, t]);

    const focusViewComponent = (
        <FocusView
            mode={mode}
            setMode={setMode}
            time={timerDuration}
            onComplete={handleTimerComplete}
            onSkip={skipTimer}
            tasks={tasks}
            activeTaskId={activeTaskId}
            onToggle={toggleTask}
            nextMode={nextMode}
        />
    );

    const taskListComponent = (
        <TaskList
            tasks={tasks}
            addTask={addTask}
            addTasks={addTasks}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            activeTaskId={activeTaskId}
            setActiveTaskId={setActiveTaskId}
            onPrioritize={handlePrioritizeTasks}
            onEditTask={setTaskToEdit}
            onReorder={reorderTasks}
            onOpenAddTaskModal={() => setIsAddTaskModalOpen(true)}
            apiKey={settings.apiKey}
        />
    );


    return (
        <LocalizationContext.Provider value={{ t, language: settings.language, setLanguage }}>
            <div className="bg-background dark:bg-background-dark text-on-background dark:text-on-background-dark min-h-screen transition-colors">
                <div className="container mx-auto max-w-6xl p-2 sm:p-4 pb-24 md:pb-4">
                    <header className="flex justify-between items-center py-4">
                        <h1 className="text-2xl font-bold text-on-surface dark:text-on-surface-dark">PomoFocus AI</h1>
                        <div className="flex items-center space-x-1">
                           <button onClick={() => setIsProgressOpen(true)} className="p-2 rounded-full text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="View Progress">
                                <ChartBarIcon />
                           </button>
                            <ThemeSwitcher theme={theme} setTheme={setTheme} />
                             <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Open settings">
                                <SettingsIcon />
                             </button>
                        </div>
                    </header>
                    <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {isMobile ? (
                            <>
                                {activeView === 'focus' && <div className="w-full">{focusViewComponent}</div>}
                                {activeView === 'tasks' && <div className="w-full">{taskListComponent}</div>}
                            </>
                        ) : (
                            <>
                                <div className="w-full md:order-1">{focusViewComponent}</div>
                                <div className="w-full md:order-2">{taskListComponent}</div>
                            </>
                        )}
                    </main>
                </div>
                {isSettingsOpen && (
                    <SettingsModal
                        settings={settings}
                        onClose={() => setIsSettingsOpen(false)}
                        onSave={setSettings}
                    />
                )}
                {isProgressOpen && (
                    <ProgressModal
                        onClose={() => setIsProgressOpen(false)}
                        stats={stats}
                    />
                )}
                {taskToEdit && (
                    <EditTaskModal
                        task={taskToEdit}
                        onClose={() => setTaskToEdit(null)}
                        onSave={(updates) => {
                            editTask(taskToEdit.id, updates);
                            setTaskToEdit(null);
                        }}
                        apiKey={settings.apiKey}
                    />
                )}
                {isAddTaskModalOpen && (
                    <AddTaskModal
                        onClose={() => setIsAddTaskModalOpen(false)}
                        onAddTask={addTask}
                        apiKey={settings.apiKey}
                    />
                )}
                {isMobile && (
                    <TabBar
                        activeView={activeView}
                        setActiveView={setActiveView}
                    />
                )}
            </div>
        </LocalizationContext.Provider>
    );
};

export default App;