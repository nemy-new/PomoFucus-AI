import { TimerMode } from './types';

export const MODE_COLORS = {
    [TimerMode.Pomodoro]: {
        primary: 'text-primary dark:text-primary-dark',
    },
    [TimerMode.ShortBreak]: {
        primary: 'text-tertiary dark:text-tertiary-dark',
    },
    [TimerMode.LongBreak]: {
        primary: 'text-secondary dark:text-secondary-dark',
    },
};

type ColorSet = { [cssVar: string]: string };

export const THEMES: {
  id: string;
  nameKey: string;
  light: ColorSet;
  dark: ColorSet;
}[] = [
    {
        id: 'default',
        nameKey: 'settings.themes.default',
        light: {
            '--light-primary': '259 52% 48%', '--light-on-primary': '0 0% 100%', '--light-primary-container': '259 100% 93%', '--light-on-primary-container': '259 100% 18%',
            '--light-secondary': '255 11% 40%', '--light-on-secondary': '0 0% 100%', '--light-secondary-container': '256 33% 93%', '--light-on-secondary-container': '256 26% 14%',
            '--light-tertiary': '342 21% 41%', '--light-on-tertiary': '0 0% 100%', '--light-tertiary-container': '343 100% 93%', '--light-on-tertiary-container': '343 49% 19%',
            '--light-error': '4 71% 43%', '--light-on-error': '0 0% 100%', '--light-error-container': '4 90% 93%', '--light-on-error-container': '4 89% 15%',
            '--light-background': '270 20% 98%', '--light-on-background': '252 8% 11%', '--light-surface': '270 20% 98%', '--light-on-surface': '252 8% 11%',
            '--light-surface-variant': '260 17% 90%', '--light-on-surface-variant': '257 10% 29%', '--light-outline': '257 8% 48%', '--light-scrim': '0 0% 0%',
        },
        dark: {
            '--dark-primary': '259 100% 87%', '--dark-on-primary': '259 58% 28%', '--dark-primary-container': '259 47% 41%', '--dark-on-primary-container': '259 100% 93%',
            '--dark-secondary': '256 31% 80%', '--dark-on-secondary': '256 25% 25%', '--dark-secondary-container': '256 20% 35%', '--dark-on-secondary-container': '256 33% 93%',
            '--dark-tertiary': '343 72% 83%', '--dark-on-tertiary': '343 48% 26%', '--dark-tertiary-container': '343 35% 37%', '--dark-on-tertiary-container': '343 100% 93%',
            '--dark-error': '4 82% 85%', '--dark-on-error': '4 89% 21%', '--dark-error-container': '4 81% 32%', '--dark-on-error-container': '4 90% 93%',
            '--dark-background': '250 10% 8%', '--dark-on-background': '260 10% 90%', '--dark-surface': '252 8% 11%', '--dark-on-surface': '260 10% 90%',
            '--dark-surface-variant': '257 10% 29%', '--dark-on-surface-variant': '257 11% 80%', '--dark-outline': '255 9% 59%',
        }
    },
    {
        id: 'forest',
        nameKey: 'settings.themes.forest',
        light: {
            '--light-primary': '135 30% 31%', '--light-on-primary': '0 0% 100%', '--light-primary-container': '134 43% 90%', '--light-on-primary-container': '136 71% 13%',
            '--light-secondary': '95 36% 45%', '--light-on-secondary': '0 0% 100%', '--light-secondary-container': '95 44% 91%', '--light-on-secondary-container': '93 54% 15%',
            '--light-tertiary': '79 53% 57%', '--light-on-tertiary': '0 0% 0%', '--light-tertiary-container': '78 57% 92%', '--light-on-tertiary-container': '81 83% 13%',
            '--light-error': '4 71% 43%', '--light-on-error': '0 0% 100%', '--light-error-container': '4 90% 93%', '--light-on-error-container': '4 89% 15%',
            '--light-background': '120 20% 98%', '--light-on-background': '120 8% 11%', '--light-surface': '120 20% 98%', '--light-on-surface': '120 8% 11%',
            '--light-surface-variant': '120 17% 90%', '--light-on-surface-variant': '120 10% 29%', '--light-outline': '120 8% 48%', '--light-scrim': '0 0% 0%',
        },
        dark: {
            '--dark-primary': '134 43% 79%', '--dark-on-primary': '135 48% 21%', '--dark-primary-container': '135 37% 29%', '--dark-on-primary-container': '134 43% 90%',
            '--dark-secondary': '95 44% 80%', '--dark-on-secondary': '94 34% 21%', '--dark-secondary-container': '95 28% 30%', '--dark-on-secondary-container': '95 44% 91%',
            '--dark-tertiary': '78 57% 81%', '--dark-on-tertiary': '79 60% 18%', '--dark-tertiary-container': '79 46% 28%', '--dark-on-tertiary-container': '78 57% 92%',
            '--dark-error': '4 82% 85%', '--dark-on-error': '4 89% 21%', '--dark-error-container': '4 81% 32%', '--dark-on-error-container': '4 90% 93%',
            '--dark-background': '120 10% 8%', '--dark-on-background': '120 10% 90%', '--dark-surface': '120 8% 11%', '--dark-on-surface': '120 10% 90%',
            '--dark-surface-variant': '120 10% 29%', '--dark-on-surface-variant': '120 11% 80%', '--dark-outline': '120 9% 59%',
        }
    },
    {
        id: 'ocean',
        nameKey: 'settings.themes.ocean',
        light: {
            '--light-primary': '202 100% 36%', '--light-on-primary': '0 0% 100%', '--light-primary-container': '197 100% 90%', '--light-on-primary-container': '203 100% 13%',
            '--light-secondary': '194 100% 39%', '--light-on-secondary': '0 0% 100%', '--light-secondary-container': '191 100% 91%', '--light-on-secondary-container': '196 100% 13%',
            '--light-tertiary': '189 74% 60%', '--light-on-tertiary': '0 0% 0%', '--light-tertiary-container': '188 95% 92%', '--light-on-tertiary-container': '191 100% 13%',
            '--light-error': '4 71% 43%', '--light-on-error': '0 0% 100%', '--light-error-container': '4 90% 93%', '--light-on-error-container': '4 89% 15%',
            '--light-background': '210 20% 98%', '--light-on-background': '210 8% 11%', '--light-surface': '210 20% 98%', '--light-on-surface': '210 8% 11%',
            '--light-surface-variant': '210 17% 90%', '--light-on-surface-variant': '210 10% 29%', '--light-outline': '210 8% 48%', '--light-scrim': '0 0% 0%',
        },
        dark: {
            '--dark-primary': '197 100% 78%', '--dark-on-primary': '202 100% 20%', '--dark-primary-container': '202 100% 27%', '--dark-on-primary-container': '197 100% 90%',
            '--dark-secondary': '191 100% 80%', '--dark-on-secondary': '194 100% 16%', '--dark-secondary-container': '193 100% 24%', '--dark-on-secondary-container': '191 100% 91%',
            '--dark-tertiary': '188 95% 82%', '--dark-on-tertiary': '190 100% 12%', '--dark-tertiary-container': '190 100% 20%', '--dark-on-tertiary-container': '188 95% 92%',
            '--dark-error': '4 82% 85%', '--dark-on-error': '4 89% 21%', '--dark-error-container': '4 81% 32%', '--dark-on-error-container': '4 90% 93%',
            '--dark-background': '210 10% 8%', '--dark-on-background': '210 10% 90%', '--dark-surface': '210 8% 11%', '--dark-on-surface': '210 10% 90%',
            '--dark-surface-variant': '210 10% 29%', '--dark-on-surface-variant': '210 11% 80%', '--dark-outline': '210 9% 59%',
        }
    }
];

export const translations = {
    en: {
        theme: {
            light: 'Light',
            dark: 'Dark',
            system: 'System',
            toggleTheme: 'Toggle theme',
        },
        timer: {
            pomodoro: 'Pomodoro',
            shortBreak: 'Short Break',
            longBreak: 'Long Break',
            ariaStart: 'Start timer',
            ariaPause: 'Pause timer',
            ariaSkip: 'Skip current session',
            addOneMinute: 'Add one minute',
            next: 'Next',
        },
        taskList: {
            title: 'Tasks',
            aiAssistant: 'AI Assistant',
            addTaskPlaceholder: 'Add a new task...',
            completed: 'Completed',
            prioritizeWithAI: 'Prioritize with AI',
            estimateWithAI: 'Estimate with AI',
            addTask: 'Add Task',
            addTaskWithOptions: 'Add task with options',
        },
        taskItem: {
            ariaSetActive: 'Set as active task',
            ariaDelete: 'Delete task',
            ariaEdit: 'Edit task',
            due: 'Due',
        },
        activeTask: {
            currentFocus: 'Current Focus',
            noTaskSelected: 'No task selected',
            selectTaskPrompt: 'Select a task to begin your focus session.',
            markAsComplete: 'Mark as Complete',
        },
        addTaskModal: {
            title: 'Add New Task',
            editTitle: 'Edit Task',
            taskTitleLabel: 'Task Title',
            estimatedPomodorosLabel: 'Estimated Pomodoros',
            etaLabel: 'Estimated Time of Arrival (Deadline)',
        },
        settings: {
            title: 'Settings',
            pomodoroTime: 'Pomodoro Time (minutes)',
            shortBreakTime: 'Short Break Time (minutes)',
            longBreakTime: 'Long Break Time (minutes)',
            longBreakInterval: 'Long Break Interval (pomodoros)',
            language: 'Language',
            enableNotifications: 'Enable Notifications',
            theme: 'Theme',
            apiKey: 'Gemini API Key',
            apiKeyPlaceholder: 'Enter your API Key here',
            apiKeyDescription: 'Your API key is stored only in your browser\'s local storage.',
            themes: {
                default: 'Default Purple',
                forest: 'Forest Green',
                ocean: 'Ocean Blue',
            },
            cancel: 'Cancel',
            save: 'Save',
        },
        aiAssistant: {
            title: 'AI Task Assistant',
            description: 'Describe a large task, and the AI will break it down into smaller, manageable sub-tasks for you.',
            placeholder: 'e.g., "Plan a surprise birthday party"',
            generate: 'Generate Sub-tasks',
            generatedTasks: 'Suggested Sub-tasks:',
            pomodoros: '({count} pomodoros)',
            cancel: 'Cancel',
            add: 'Add to Tasks',
        },
        gemini: {
            prompt: `You are an expert project manager. Break down the following main task into smaller, actionable sub-tasks suitable for a Pomodoro timer. Each sub-task should take between 1 to 3 Pomodoro sessions (25 minutes each). Output the response in {{language}}. The main task is: "{{mainTask}}". Return a JSON array of objects, where each object has "title" (a short, clear title for the sub-task) and "estimatedPomodoros" (an integer between 1 and 3). Do not include any other text or explanation.`,
            error: 'Failed to get suggestions from AI. Please check your API key and try again.',
            prioritizePrompt: `You are an expert project manager. Based on the following list of tasks, determine the optimal order to work on them. Consider urgency, importance, estimated effort (in pomodoros), and any deadlines (eta). Return only a JSON array of task IDs in the prioritized order. The tasks are: {{tasksJson}}`,
            prioritizeError: 'Failed to prioritize tasks with AI. Please check your API key and try again.',
            estimatePrompt: `You are a productivity expert. Estimate the number of 25-minute Pomodoro sessions required to complete the following task. The estimate should be an integer between 1 and 5. The task is: "{{taskTitle}}". Return a single JSON object with the key "estimatedPomodoros" and the integer value. Do not include any other text.`,
            estimateError: 'Failed to estimate pomodoros. Please check your API key and try again.',
            apiKeyError: 'API key is not configured. Please set it in the settings.',
        },
        progress: {
            title: "Today's Progress",
            pomodoros: "Pomodoros Completed",
            tasks: "Tasks Completed",
            close: "Close",
            focusTime: "Focus Time",
            streak: "Day Streak",
            activity: "Last 7 Days Activity",
            days: "days",
            minutes: "min"
        },
        notifications: {
            title: "PomoFocus AI",
            body: {
                [TimerMode.ShortBreak]: "Pomodoro finished! Time for a short break.",
                [TimerMode.LongBreak]: "Pomodoro finished! Time for a long break.",
                [TimerMode.Pomodoro]: "Break's over! Time to focus.",
            }
        }
    },
    ja: {
        theme: {
            light: 'ライト',
            dark: 'ダーク',
            system: 'システム',
            toggleTheme: 'テーマを切り替え',
        },
        timer: {
            pomodoro: '作業',
            shortBreak: '短い休憩',
            longBreak: '長い休憩',
            ariaStart: 'タイマーを開始',
            ariaPause: 'タイマーを一時停止',
            ariaSkip: '現在のセッションをスキップ',
            addOneMinute: '1分追加',
            next: 'next',
        },
        taskList: {
            title: 'タスク',
            aiAssistant: 'AIアシスタント',
            addTaskPlaceholder: '新しいタスクを追加...',
            completed: '完了済み',
            prioritizeWithAI: 'AIで優先順位付け',
            estimateWithAI: 'AIで見積もり',
            addTask: 'タスクを追加',
            addTaskWithOptions: 'オプション付きでタスクを追加',
        },
        taskItem: {
            ariaSetActive: 'アクティブなタスクとして設定',
            ariaDelete: 'タスクを削除',
            ariaEdit: 'タスクを編集',
            due: '期限',
        },
        activeTask: {
            currentFocus: '現在のフォーカス',
            noTaskSelected: 'タスクが選択されていません',
            selectTaskPrompt: 'タスクを選択して集中セッションを開始しましょう。',
            markAsComplete: '完了にする',
        },
        addTaskModal: {
            title: '新しいタスクを追加',
            editTitle: 'タスクを編集',
            taskTitleLabel: 'タスクのタイトル',
            estimatedPomodorosLabel: '見積もり作業回数',
            etaLabel: '完了予定日時（締め切り）',
        },
        settings: {
            title: '設定',
            pomodoroTime: '作業時間（分）',
            shortBreakTime: '短い休憩時間（分）',
            longBreakTime: '長い休憩時間（分）',
            longBreakInterval: '長い休憩の間隔（作業回数）',
            language: '言語',
            enableNotifications: '通知を有効にする',
            theme: 'テーマ',
            apiKey: 'Gemini APIキー',
            apiKeyPlaceholder: 'APIキーをここに入力',
            apiKeyDescription: 'APIキーはブラウザのローカルストレージにのみ保存されます。',
            themes: {
                default: 'デフォルト',
                forest: 'フォレストグリーン',
                ocean: 'オーシャンブルー',
            },
            cancel: 'キャンセル',
            save: '保存',
        },
        aiAssistant: {
            title: 'AIタスクアシスタント',
            description: '大きなタスクを説明すると、AIがそれを管理しやすい小さなサブタスクに分割します。',
            placeholder: '例：「サプライズ誕生日パーティーを計画する」',
            generate: 'サブタスクを生成',
            generatedTasks: '提案されたサブタスク：',
            pomodoros: '({count} 作業)',
            cancel: 'キャンセル',
            add: 'タスクに追加',
        },
        gemini: {
            prompt: `あなたは熟練したプロジェクトマネージャーです。次の主要タスクを、作業タイマーに適した、より小さく実行可能なサブタスクに分割してください。各サブタスクは1〜3回の作業セッション（各25分）で完了できるようにしてください。応答は{{language}}で出力してください。主要タスクは「{{mainTask}}」です。オブジェクトのJSON配列を返してください。各オブジェクトには、「title」（サブタスクの短く明確なタイトル）と「estimatedPomodoros」（1〜3の整数）が含まれます。他のテキストや説明は含めないでください。`,
            error: 'AIからの提案の取得に失敗しました。APIキーを確認して、もう一度お試しください。',
            prioritizePrompt: `あなたは熟練したプロジェクトマネージャーです。以下のタスクリストに基づき、作業に最適な順序を決定してください。緊急性、重要性、推定される労力（作業回数）、および締め切り（eta）を考慮してください。優先順位付けされたタスクIDのJSON配列のみを返してください。タスクは次のとおりです：{{tasksJson}}`,
            prioritizeError: 'AIによるタスクの優先順位付けに失敗しました。APIキーを確認して、もう一度お試しください。',
            estimatePrompt: `あなたは生産性の専門家です。次のタスクを完了するために必要な25分間の作業セッションの回数を見積もってください。見積もりは1から5の間の整数である必要があります。タスク：「{{taskTitle}}」。キー「estimatedPomodoros」と整数値を持つ単一のJSONオブジェクトのみを返してください。他のテキストは含めないでください。`,
            estimateError: 'ポモドーロ数の見積もりに失敗しました。APIキーを確認して、もう一度お試しください。',
            apiKeyError: 'APIキーが設定されていません。設定画面でキーを設定してください。',
        },
        progress: {
            title: "今日の進捗",
            pomodoros: "完了した作業",
            tasks: "完了したタスク",
            close: "閉じる",
            focusTime: "集中時間",
            streak: "継続日数",
            activity: "過去7日間のアクティビティ",
            days: "日",
            minutes: "分"
        },
        notifications: {
            title: "PomoFocus AI",
            body: {
                [TimerMode.ShortBreak]: "作業が完了しました！短い休憩の時間です。",
                [TimerMode.LongBreak]: "作業が完了しました！長い休憩の時間です。",
                [TimerMode.Pomodoro]: "休憩は終わりです！集中する時間です。",
            }
        }
    },
};