import React, { useState, useEffect } from 'react';
import { type Settings } from '../types';
import { THEMES } from '../constants';
import { useLocalization } from '../App';

interface SettingsModalProps {
    settings: Settings;
    onClose: () => void;
    onSave: (newSettings: Settings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onClose, onSave }) => {
    const [currentSettings, setCurrentSettings] = useState(settings);
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

    const handleSave = () => {
        onSave(currentSettings);
        handleClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentSettings(prev => ({ ...prev, [name]: name.includes('Time') || name.includes('Interval') ? Number(value) : value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setCurrentSettings(prev => ({ ...prev, [name]: checked }));
    };

    const handleThemeChange = (themeId: string) => {
      setCurrentSettings(prev => ({ ...prev, themeName: themeId }));
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
                <h2 className="text-xl font-semibold mb-6 text-on-surface dark:text-on-surface-dark">{t('settings.title')}</h2>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label htmlFor="apiKey" className="block text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">{t('settings.apiKey')}</label>
                        <input
                            type="password"
                            name="apiKey"
                            id="apiKey"
                            value={currentSettings.apiKey || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-surface-variant/30 dark:bg-surface-variant-dark/30 border border-outline dark:border-outline-dark rounded-md focus:border-primary dark:focus:border-primary-dark focus:ring-0 focus:outline-none"
                            placeholder={t('settings.apiKeyPlaceholder')}
                        />
                        <p className="mt-2 text-xs text-on-surface-variant dark:text-on-surface-variant-dark">{t('settings.apiKeyDescription')}</p>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">{t('settings.theme')}</label>
                        <div className="mt-2 grid grid-cols-3 gap-3">
                            {THEMES.map(theme => (
                                <div key={theme.id} className="text-center">
                                    <button 
                                        onClick={() => handleThemeChange(theme.id)}
                                        className={`w-full h-16 rounded-lg border-2 transition-all ${currentSettings.themeName === theme.id ? 'border-primary dark:border-primary-dark ring-2 ring-primary/50' : 'border-outline/50 dark:border-outline-dark/50'}`}
                                        style={{ backgroundColor: `hsl(${theme.light['--light-primary-container']})` }}
                                        aria-label={`Select ${t(theme.nameKey)} theme`}
                                    >
                                        <div className="w-8 h-8 rounded-full mx-auto" style={{ backgroundColor: `hsl(${theme.light['--light-primary']})`}}></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="pomodoroTime" className="block text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">{t('settings.pomodoroTime')}</label>
                        <input
                            type="number"
                            name="pomodoroTime"
                            id="pomodoroTime"
                            value={currentSettings.pomodoroTime}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-surface-variant/30 dark:bg-surface-variant-dark/30 border border-outline dark:border-outline-dark rounded-md focus:border-primary dark:focus:border-primary-dark focus:ring-0 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="shortBreakTime" className="block text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">{t('settings.shortBreakTime')}</label>
                        <input
                            type="number"
                            name="shortBreakTime"
                            id="shortBreakTime"
                            value={currentSettings.shortBreakTime}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-surface-variant/30 dark:bg-surface-variant-dark/30 border border-outline dark:border-outline-dark rounded-md focus:border-primary dark:focus:border-primary-dark focus:ring-0 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="longBreakTime" className="block text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">{t('settings.longBreakTime')}</label>
                        <input
                            type="number"
                            name="longBreakTime"
                            id="longBreakTime"
                            value={currentSettings.longBreakTime}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-surface-variant/30 dark:bg-surface-variant-dark/30 border border-outline dark:border-outline-dark rounded-md focus:border-primary dark:focus:border-primary-dark focus:ring-0 focus:outline-none"
                        />
                    </div>
                     <div>
                        <label htmlFor="longBreakInterval" className="block text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">{t('settings.longBreakInterval')}</label>
                        <input
                            type="number"
                            name="longBreakInterval"
                            id="longBreakInterval"
                            value={currentSettings.longBreakInterval}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-surface-variant/30 dark:bg-surface-variant-dark/30 border border-outline dark:border-outline-dark rounded-md focus:border-primary dark:focus:border-primary-dark focus:ring-0 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">{t('settings.language')}</label>
                        <select
                            name="language"
                            id="language"
                            value={currentSettings.language}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 bg-surface-variant/30 dark:bg-surface-variant-dark/30 border border-outline dark:border-outline-dark rounded-md focus:border-primary dark:focus:border-primary-dark focus:ring-0 focus:outline-none text-on-surface dark:text-on-surface-dark"
                        >
                            <option value="en" className="bg-surface dark:bg-surface-dark text-on-surface dark:text-on-surface-dark">English</option>
                            <option value="ja" className="bg-surface dark:bg-surface-dark text-on-surface dark:text-on-surface-dark">日本語 (Japanese)</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <label htmlFor="notificationsEnabled" className="text-sm font-medium text-on-surface-variant dark:text-on-surface-variant-dark">{t('settings.enableNotifications')}</label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox"
                                id="notificationsEnabled"
                                name="notificationsEnabled"
                                checked={currentSettings.notificationsEnabled}
                                onChange={handleCheckboxChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 dark:peer-focus:ring-primary-dark/50 rounded-full peer dark:bg-outline peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary dark:peer-checked:bg-primary-dark"></div>
                        </label>
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
                        onClick={handleSave}
                        className="px-4 py-2 bg-primary dark:bg-primary-dark text-on-primary dark:text-on-primary-dark font-semibold rounded-full hover:opacity-90 transition-opacity shadow-sm"
                    >
                        {t('settings.save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;