import React from 'react';
import { useLocalization } from '../App';
import { ClipboardListIcon } from './icons/ClipboardListIcon';

const EmptyState: React.FC = () => {
    const { language } = useLocalization();

    const texts = {
        en: {
            title: "Ready to focus?",
            subtitle: "Add your first task below to get started."
        },
        ja: {
            title: "集中する準備はできましたか？",
            subtitle: "下のフォームから最初のタスクを追加して始めましょう。"
        }
    }

    return (
        <div className="text-center py-8 px-6 bg-surface-variant/30 dark:bg-surface-variant-dark/30 rounded-xl border-2 border-dashed border-outline-dark/30 dark:border-outline-dark/50">
            <div className="flex justify-center items-center mb-4">
                <ClipboardListIcon />
            </div>
            <h3 className="text-xl font-semibold text-on-surface dark:text-on-surface-dark">{texts[language].title}</h3>
            <p className="text-on-surface-variant dark:text-on-surface-variant-dark mt-2">{texts[language].subtitle}</p>
        </div>
    );
};

export default EmptyState;