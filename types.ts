export interface Task {
    id: string;
    title: string;
    completed: boolean;
    pomodoros: number;
    estimatedPomodoros: number;
    eta?: string;
}

export enum TimerMode {
    Pomodoro = 'pomodoro',
    ShortBreak = 'shortBreak',
    LongBreak = 'longBreak',
}

export interface Settings {
    pomodoroTime: number;
    shortBreakTime: number;
    longBreakTime: number;
    longBreakInterval: number;
    language: 'en' | 'ja';
    notificationsEnabled: boolean;
    themeName: string;
    apiKey?: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface DailyStats {
    pomodoros: number;
    focusMinutes: number;
}

export interface Stats {
    [date: string]: DailyStats;
}