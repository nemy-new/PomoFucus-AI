import React, { useState, useEffect } from 'react';
import { useLocalization } from '../App';
import { estimatePomodorosForTask } from '../services/geminiService';
import { SparklesIcon } from './icons/SparklesIcon';

interface AddTaskModalProps {
    onClose: () => void;
    onAddTask: (title: string, estimatedPomodoros: number, eta: string) => void;
    apiKey?: string;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, onAddTask, apiKey }) => {
    const [isEntering, setIsEntering] = useState(false);
    const [title, setTitle] = useState('');
    const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
    const [eta, setEta] = useState('');
    const [isEstimating, setIsEstimating] = useState(false);
    const { t, language } = useLocalization();

    useEffect(() => {
        const timer = setTimeout(() => setIsEntering(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsEntering(false);
        setTimeout(onClose, 200);
    };

    const handleEstimateWithAI = async () => {
        if (!title.trim() || !apiKey) return;
        setIsEstimating(true);
        try {
            const estimated = await estimatePomodorosForTask(apiKey, title, language);
            setEstimatedPomodoros(estimated);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : String(error));
        } finally {
            setIsEstimating(false);
        }
    };

    const handleSubmit = () => {
        if (title.trim()) {
            onAddTask(title.trim(), estimatedPomodoros, eta);
            handleClose();
        }
    };

    return (
        <div 
            className={`fixed inset-0 bg-scrim/50 flex justify-center items-center z-50 p-4 transition-opacity duration-200 ease-out ${isEntering ? 'opacity-100' : 'opacity-0'}`} 
            onClick={handleClose}
        >
            <div 
                className={`bg-surface dark:bg-surface-dark rounded-xl shadow-xl p-6 w-full max-w-md transition-all duration-200 ease-out ${isEntering ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-6 text-on-surface dark:text-on-surface-dark">{t('addTaskModal.title')}</h2>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="taskTitle" className="block text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">{t('addTaskModal.taskTitleLabel')}</label>
                        <input
                            type="text"
                            id="taskTitle"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('taskList.addTaskPlaceholder')}
                            className="mt-1 block w-full p-2 bg-surface-variant/30 dark:bg-surface-variant-dark/30 border border-outline dark:border-outline-dark rounded-md focus:border-primary dark:focus:border-primary-dark focus:ring-0 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="estimatedPomodoros" className="block text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">{t('addTaskModal.estimatedPomodorosLabel')}</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input 
                                type="number"
                                id="estimatedPomodoros"
                                min="1"
                                max="5"
                                value={estimatedPomodoros}
                                onChange={(e) => setEstimatedPomodoros(Number(e.target.value))}
                                className="w-20 p-2 text-center bg-surface-variant/30 dark:bg-surface-variant-dark/30 border border-outline dark:border-outline-dark rounded-md focus:border-primary dark:focus:border-primary-dark focus:ring-0 focus:outline-none"
                            />
                            <button 
                                type="button" 
                                onClick={handleEstimateWithAI}
                                disabled={!apiKey || isEstimating || !title.trim()}
                                className="bg-secondary-container dark:bg-secondary-container-dark text-on-secondary-container dark:text-on-secondary-container-dark p-2 rounded-md hover:opacity-90 transition-opacity shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary disabled:opacity-50 flex-grow flex items-center justify-center space-x-2"
                                title={!apiKey ? t('gemini.apiKeyError') : undefined}
                            >
                                {isEstimating 
                                    ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div> 
                                    : <SparklesIcon />
                                }
                                <span>{t('taskList.estimateWithAI')}</span>
                            </button>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="eta" className="block text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">{t('addTaskModal.etaLabel')}</label>
                        <input
                            type="datetime-local"
                            id="eta"
                            value={eta}
                            onChange={(e) => setEta(e.target.value)}
                            className="mt-1 block w-full p-2 bg-surface-variant/30 dark:bg-surface-variant-dark/30 border border-outline dark:border-outline-dark rounded-md focus:border-primary dark:focus:border-primary-dark focus:ring-0 focus:outline-none"
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-end space-x-2">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-full text-primary dark:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 font-semibold transition-colors"
                    >
                        {t('settings.cancel')}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-primary dark:bg-primary-dark text-on-primary dark:text-on-primary-dark font-semibold rounded-full hover:opacity-90 transition-opacity shadow-sm"
                    >
                        {t('taskList.addTask')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;