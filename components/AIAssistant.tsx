import React, { useState, useEffect } from 'react';
import { breakDownTask } from '../services/geminiService';
import { type Task } from '../types';
import { useLocalization } from '../App';

interface AIAssistantProps {
    onClose: () => void;
    addTasks: (tasks: Omit<Task, 'id' | 'completed' | 'pomodoros'>[]) => void;
    language: 'en' | 'ja';
    apiKey: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose, addTasks, language, apiKey }) => {
    const [mainTask, setMainTask] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedTasks, setGeneratedTasks] = useState<Omit<Task, 'id' | 'completed' | 'pomodoros'>[]>([]);
    const [isEntering, setIsEntering] = useState(false);
    const { t } = useLocalization();

    useEffect(() => {
        const timer = setTimeout(() => setIsEntering(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsEntering(false);
        setTimeout(onClose, 200);
    };

    const handleGenerate = async () => {
        if (!mainTask.trim()) return;
        setIsLoading(true);
        setError(null);
        setGeneratedTasks([]);
        try {
            const tasks = await breakDownTask(apiKey, mainTask, language);
            setGeneratedTasks(tasks);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTasks = () => {
        addTasks(generatedTasks);
        handleClose();
    };

    return (
        <div 
            className={`fixed inset-0 bg-scrim/50 flex justify-center items-center z-50 p-4 transition-opacity duration-200 ease-out ${isEntering ? 'opacity-100' : 'opacity-0'}`} 
            onClick={handleClose}
        >
            <div 
                className={`bg-surface dark:bg-surface-dark rounded-xl shadow-xl p-6 w-full max-w-lg transition-all duration-200 ease-out ${isEntering ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} 
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold mb-2 text-on-surface dark:text-on-surface-dark flex items-center">
                    {t('aiAssistant.title')}
                </h2>
                <p className="text-on-surface-variant dark:text-on-surface-variant-dark mb-6 text-sm">{t('aiAssistant.description')}</p>

                <div className="space-y-4">
                    <textarea
                        value={mainTask}
                        onChange={(e) => setMainTask(e.target.value)}
                        placeholder={t('aiAssistant.placeholder')}
                        className="w-full p-3 bg-surface-variant/30 dark:bg-surface-variant-dark/30 border border-outline dark:border-outline-dark rounded-md focus:border-primary dark:focus:border-primary-dark focus:ring-0 focus:outline-none"
                        rows={3}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !mainTask.trim()}
                        className="w-full bg-primary dark:bg-primary-dark text-on-primary dark:text-on-primary-dark font-semibold py-2.5 px-4 rounded-full hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                        ) : (
                            t('aiAssistant.generate')
                        )}
                    </button>
                </div>
                
                {error && <p className="text-error dark:text-error-dark mt-4 text-sm">{error}</p>}

                {generatedTasks.length > 0 && !isLoading && (
                    <div className="mt-6">
                        <h3 className="text-base font-semibold text-on-surface dark:text-on-surface-dark mb-3">{t('aiAssistant.generatedTasks')}</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {generatedTasks.map((task, index) => (
                                <div key={index} className="p-3 bg-surface-variant/50 dark:bg-surface-variant-dark/50 rounded-md flex justify-between items-center">
                                    <span className="text-on-surface-variant dark:text-on-surface-variant-dark text-sm">{task.title}</span>
                                    <span className="text-sm text-on-surface-variant/80 dark:text-on-surface-variant-dark/80">{t('aiAssistant.pomodoros', { count: task.estimatedPomodoros })}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                <div className="mt-8 flex justify-end space-x-2">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 rounded-full text-primary dark:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 font-semibold transition-colors"
                    >
                        {t('aiAssistant.cancel')}
                    </button>
                    <button
                        onClick={handleAddTasks}
                        disabled={generatedTasks.length === 0}
                        className="px-4 py-2 bg-primary dark:bg-primary-dark text-on-primary dark:text-on-primary-dark font-semibold rounded-full hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t('aiAssistant.add')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;