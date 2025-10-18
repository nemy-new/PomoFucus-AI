import React, { useState } from 'react';
import { type Task } from '../types';
import TaskItem from './TaskItem';
import AIAssistant from './AIAssistant';
import { PlusIcon } from './icons/PlusIcon';
import { useLocalization } from '../App';
import { SparklesIcon } from './icons/SparklesIcon';
import { WandIcon } from './icons/WandIcon';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { MoreOptionsIcon } from './icons/MoreOptionsIcon';

interface TaskListProps {
    tasks: Task[];
    addTask: (title: string, estimatedPomodoros: number, eta: string) => void;
    addTasks: (tasks: Omit<Task, 'id' | 'completed' | 'pomodoros'>[]) => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    activeTaskId: string | null;
    setActiveTaskId: (id: string | null) => void;
    onPrioritize: () => Promise<void>;
    onEditTask: (task: Task) => void;
    onReorder: (sourceIndex: number, destinationIndex: number) => void;
    onOpenAddTaskModal: () => void;
    apiKey?: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, addTask, addTasks, toggleTask, deleteTask, activeTaskId, setActiveTaskId, onPrioritize, onEditTask, onReorder, onOpenAddTaskModal, apiKey }) => {
    const [isAIOpen, setIsAIOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isPrioritizing, setIsPrioritizing] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const { t } = useLocalization();

    const uncompletedTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    const hasTasks = tasks.length > 0;

    const handlePrioritizeClick = async () => {
        setIsPrioritizing(true);
        try {
            await onPrioritize();
        } finally {
            setIsPrioritizing(false);
        }
    };
    
    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            addTask(newTaskTitle.trim(), 1, '');
            setNewTaskTitle('');
        }
    };

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (draggedIndex !== null && draggedIndex !== dropIndex) {
            onReorder(draggedIndex, dropIndex);
        }
        setDraggedIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };


    const emptyStateTexts = {
        en: { subtitle: "Add your first task below to get started." },
        ja: { subtitle: "下のフォームから最初のタスクを追加して始めましょう。" }
    };
    const currentTexts = emptyStateTexts[useLocalization().language];

    return (
        <div className="relative min-h-[300px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-on-surface dark:text-on-surface-dark">{t('taskList.title')}</h2>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={handlePrioritizeClick}
                        disabled={!apiKey || isPrioritizing || uncompletedTasks.length <= 1}
                        className="bg-secondary-container dark:bg-secondary-container-dark text-on-secondary-container dark:text-on-secondary-container-dark px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={!apiKey ? t('gemini.apiKeyError') : undefined}
                    >
                        {isPrioritizing ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" role="status"></div>
                        ) : (
                            <SparklesIcon />
                        )}
                        <span>{t('taskList.prioritizeWithAI')}</span>
                    </button>
                    <button
                        onClick={() => setIsAIOpen(true)}
                        disabled={!apiKey}
                        className="bg-tertiary-container dark:bg-tertiary-container-dark text-on-tertiary-container dark:text-on-tertiary-container-dark px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={!apiKey ? t('gemini.apiKeyError') : undefined}
                    >
                        <WandIcon />
                        <span>{t('taskList.aiAssistant')}</span>
                    </button>
                </div>
            </div>
            
            {hasTasks ? (
                <>
                    <div className="space-y-3">
                        {uncompletedTasks.map((task, index) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                isActive={task.id === activeTaskId}
                                onToggle={() => toggleTask(task.id)}
                                onDelete={() => deleteTask(task.id)}
                                onSelect={() => setActiveTaskId(task.id === activeTaskId ? null : task.id)}
                                onEdit={() => onEditTask(task)}
                                isDraggable={true}
                                isDragging={draggedIndex === index}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e)}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                            />
                        ))}
                    </div>

                    {completedTasks.length > 0 && (
                         <div className="mt-6">
                            <h3 className="text-base font-semibold text-on-surface-variant dark:text-on-surface-variant-dark mb-3 px-2">{t('taskList.completed')}</h3>
                             <div className="space-y-2">
                                {completedTasks.map(task => (
                                    <TaskItem
                                        key={task.id}
                                        task={task}
                                        isActive={false}
                                        onToggle={() => toggleTask(task.id)}
                                        onDelete={() => deleteTask(task.id)}
                                        onSelect={() => {}}
                                        onEdit={() => onEditTask(task)}
                                        isDraggable={false}
                                    />
                                ))}
                            </div>
                         </div>
                    )}
                </>
            ) : (
                <div className="flex-grow flex flex-col justify-center items-center text-center p-8 bg-surface-variant/30 dark:bg-surface-variant-dark/30 rounded-xl border-2 border-dashed border-outline/30 dark:border-outline-dark/30">
                    <ClipboardListIcon />
                    <p className="text-on-surface-variant dark:text-on-surface-variant-dark mt-4 max-w-xs">{currentTexts.subtitle}</p>
                </div>
            )}
            
            <div className="mt-4">
                 <form onSubmit={handleAddTask} className="flex items-center gap-3 p-2 bg-surface dark:bg-surface-dark rounded-xl shadow-sm border border-outline/20 dark:border-outline-dark/20 focus-within:ring-2 focus-within:ring-primary dark:focus-within:ring-primary-dark transition-shadow">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder={t('taskList.addTaskPlaceholder')}
                        className="w-full bg-transparent focus:outline-none text-on-surface dark:text-on-surface-dark placeholder:text-on-surface-variant px-2"
                        aria-label={t('taskList.addTaskPlaceholder')}
                    />
                     <button
                        type="button"
                        onClick={onOpenAddTaskModal}
                        aria-label={t('taskList.addTaskWithOptions')}
                        className="p-2 rounded-full text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10 transition-colors flex-shrink-0"
                    >
                        <MoreOptionsIcon />
                    </button>
                    <button
                        type="submit"
                        disabled={!newTaskTitle.trim()}
                        aria-label={t('taskList.addTask')}
                        className="p-2.5 rounded-full bg-primary dark:bg-primary-dark text-on-primary dark:text-on-primary-dark hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        <PlusIcon />
                    </button>
                </form>
            </div>

            {isAIOpen && apiKey && (
                <AIAssistant 
                    onClose={() => setIsAIOpen(false)}
                    addTasks={addTasks}
                    language={useLocalization().language}
                    apiKey={apiKey}
                />
            )}
        </div>
    );
};

export default TaskList;