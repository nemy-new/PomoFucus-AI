import React, { useMemo } from 'react';
import { type Task } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { FocusIcon } from './icons/FocusIcon';
import { EditIcon } from './icons/EditIcon';
import { DragHandleIcon } from './icons/DragHandleIcon';
import { useLocalization } from '../App';

interface TaskItemProps {
    task: Task;
    isActive: boolean;
    onToggle: () => void;
    onDelete: () => void;
    onSelect: () => void;
    onEdit: () => void;
    isDraggable: boolean;
    isDragging?: boolean;
    onDragStart?: (e: React.DragEvent) => void;
    onDragOver?: (e: React.DragEvent) => void;
    onDrop?: (e: React.DragEvent) => void;
    onDragEnd?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, isActive, onToggle, onDelete, onSelect, onEdit, isDraggable, isDragging, onDragStart, onDragOver, onDrop, onDragEnd }) => {
    const { t, language } = useLocalization();

    const isOverdue = task.eta ? new Date(task.eta) < new Date() && !task.completed : false;

    const formattedEta = useMemo(() => {
        if (!task.eta) return null;
        try {
            return new Intl.DateTimeFormat(language, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            }).format(new Date(task.eta));
        } catch (e) {
            console.error("Invalid ETA date format:", task.eta);
            return null;
        }
    }, [task.eta, language]);


    return (
        <div 
            className={`p-4 rounded-lg transition-all duration-200 border-2 ${isActive ? 'bg-secondary-container dark:bg-secondary-container-dark border-primary dark:border-primary-dark' : 'bg-surface dark:bg-surface-dark border-transparent hover:bg-surface-variant/40 dark:hover:bg-surface-variant-dark/40'} ${isDragging ? 'opacity-50 shadow-2xl' : ''}`}
            draggable={isDraggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
        >
            <div className="flex items-start">
                 {isDraggable && (
                     <span className="p-1 cursor-grab text-on-surface-variant/70 dark:text-on-surface-variant-dark/70 touch-none mt-0.5">
                         <DragHandleIcon />
                     </span>
                )}
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={onToggle}
                    className={`h-6 w-6 rounded border-outline dark:border-outline-dark text-primary dark:text-primary-dark focus:ring-primary dark:focus:ring-primary-dark bg-surface dark:bg-surface-dark mt-0.5 ${isDraggable ? 'ml-2' : ''}`}
                />
                <div className="ml-4 flex-grow cursor-pointer" onClick={onSelect}>
                    <p className={`font-medium text-on-surface dark:text-on-surface-dark ${task.completed ? 'line-through text-on-surface/50 dark:text-on-surface-dark/50' : ''}`}>
                        {task.title}
                    </p>
                    {formattedEta && (
                        <div className={`text-xs mt-1 ${isOverdue ? 'font-semibold text-error dark:text-error-dark' : 'text-on-surface-variant dark:text-on-surface-variant-dark'}`}>
                            {t('taskItem.due')}: {formattedEta}
                        </div>
                    )}
                </div>
                <div className="flex items-center ml-4">
                    {!task.completed && (
                        <button
                            onClick={onSelect}
                            className={`p-2 rounded-full transition-colors ${isActive ? 'text-primary dark:text-primary-dark' : 'text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10'}`}
                            aria-label={t('taskItem.ariaSetActive')}
                        >
                            <FocusIcon />
                        </button>
                    )}
                     <button
                        onClick={onEdit}
                        className="p-2 rounded-full text-on-surface-variant dark:text-on-surface-variant-dark hover:bg-on-surface/10 dark:hover:bg-on-surface-dark/10 transition-colors"
                        aria-label={t('taskItem.ariaEdit')}
                    >
                        <EditIcon />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 rounded-full text-on-surface-variant dark:text-on-surface-variant-dark hover:text-error dark:hover:text-error-dark hover:bg-error-container/50 dark:hover:bg-error-container-dark/50 transition-colors"
                        aria-label={t('taskItem.ariaDelete')}
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
            {!task.completed && (
                <div className="mt-3 flex items-center gap-2 text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
                    <div className="w-full h-1.5 bg-surface-variant/50 dark:bg-surface-variant-dark/50 rounded-full overflow-hidden">
                        <div className="h-full bg-primary dark:bg-primary-dark transition-all duration-300" style={{ width: `${task.estimatedPomodoros > 0 ? (task.pomodoros / task.estimatedPomodoros) * 100 : 0}%` }}></div>
                    </div>
                    <span>{task.pomodoros}/{task.estimatedPomodoros}</span>
                </div>
            )}
        </div>
    );
};

export default TaskItem;