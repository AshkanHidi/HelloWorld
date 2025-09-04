import React from 'react';
import { ChipIcon, ExclamationTriangleIcon } from './icons';
import { ModelSelection } from './ModelSelection';
import { ModelStatusDisplay } from './ModelStatusDisplay';
import type { ModelStatus } from '../types';

interface ModelManagerProps {
    isChecking: boolean;
    statuses: Record<string, ModelStatus>;
    allModels: string[];
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    disabled: boolean;
}

export const ModelManager: React.FC<ModelManagerProps> = ({
    isChecking,
    statuses,
    allModels,
    selectedModel,
    setSelectedModel,
    disabled
}) => {
    const statusOrder: Record<ModelStatus, number> = {
        'available': 1,
        'checking': 2,
        'unknown': 3,
        'error': 4,
    };

    const sortedModels = [...allModels].sort((a, b) => {
        const statusA = statuses[a] || 'unknown';
        const statusB = statuses[b] || 'unknown';
        if (statusOrder[statusA] !== statusOrder[statusB]) {
            return statusOrder[statusA] - statusOrder[statusB];
        }
        return a.localeCompare(b);
    });
    
    const selectedModelStatus = statuses[selectedModel];
    const showWarning = selectedModel && selectedModelStatus && selectedModelStatus !== 'available';

    return (
        <div className="space-y-4">
            {isChecking && (
                <div className="flex items-center justify-center p-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                    <ChipIcon className="w-5 h-5 me-2 animate-spin" />
                    <span>در حال بررسی وضعیت مدل‌ها...</span>
                </div>
            )}
            
            <ModelStatusDisplay statuses={statuses} sortedModels={sortedModels} />
            
            <ModelSelection
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                allModels={allModels}
                statuses={statuses}
                disabled={disabled}
            />

            {showWarning && (
                <div className="flex items-start gap-3 p-3 text-sm text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg border border-yellow-300 dark:border-yellow-600/50">
                    <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 text-yellow-500 flex-shrink-0" />
                    <p>
                        <strong>هشدار:</strong> مدل انتخاب شده در حال حاضر در دسترس نیست یا وضعیت آن نامشخص است. استفاده از آن ممکن است منجر به شکست عملیات ترجمه شود.
                    </p>
                </div>
            )}
        </div>
    );
};