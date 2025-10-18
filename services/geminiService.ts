import { GoogleGenAI, Type } from "@google/genai";
import { type Task } from '../types';
import { translations } from '../constants';

const getAiClient = (apiKey: string) => {
    return new GoogleGenAI({ apiKey });
};

export const breakDownTask = async (apiKey: string, mainTask: string, language: 'en' | 'ja'): Promise<Omit<Task, 'id' | 'completed' | 'pomodoros'>[]> => {
    if (!apiKey) {
        throw new Error(translations[language].gemini.apiKeyError);
    }
    try {
        const ai = getAiClient(apiKey);
        const langName = language === 'ja' ? 'Japanese' : 'English';
        const prompt = translations[language].gemini.prompt
            .replace('{{language}}', langName)
            .replace('{{mainTask}}', mainTask);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: {
                                type: Type.STRING,
                                description: 'A short, clear title for the sub-task.',
                            },
                            estimatedPomodoros: {
                                type: Type.INTEGER,
                                description: 'The estimated number of 25-minute pomodoro sessions to complete this sub-task. Must be between 1 and 3.',
                            },
                        },
                        required: ["title", "estimatedPomodoros"],
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const generatedTasks = JSON.parse(jsonText);
        
        if (!Array.isArray(generatedTasks)) {
            throw new Error("AI response is not an array.");
        }

        return generatedTasks.map((t: any) => ({
            title: t.title || 'Untitled Task',
            // Fix: Clamping estimated pomodoros to 3 to match the prompt's constraint.
            estimatedPomodoros: Math.max(1, Math.min(3, t.estimatedPomodoros || 1)),
        }));

    } catch (error) {
        console.error("Error breaking down task with Gemini:", error);
        throw new Error(translations[language].gemini.error);
    }
};

export const prioritizeTasks = async (apiKey: string, tasks: Task[], language: 'en' | 'ja'): Promise<string[]> => {
    if (!apiKey) {
        throw new Error(translations[language].gemini.apiKeyError);
    }
    if (tasks.length === 0) {
        return [];
    }
    try {
        const ai = getAiClient(apiKey);
        const tasksJson = JSON.stringify(tasks.map(t => ({ id: t.id, title: t.title, estimatedPomodoros: t.estimatedPomodoros, eta: t.eta })));

        const prompt = translations[language].gemini.prioritizePrompt
            .replace('{{tasksJson}}', tasksJson);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const sortedIds = JSON.parse(jsonText);
        
        if (!Array.isArray(sortedIds) || sortedIds.some(id => typeof id !== 'string')) {
            throw new Error("AI response is not an array of strings.");
        }

        const originalIds = new Set(tasks.map(t => t.id));
        const returnedIds = new Set(sortedIds);
        if (originalIds.size !== returnedIds.size || ![...originalIds].every(id => returnedIds.has(id))) {
            console.warn("AI returned a different set of task IDs. Returning original order.");
            return tasks.map(t => t.id);
        }
        
        return sortedIds;

    } catch (error) {
        console.error("Error prioritizing tasks with Gemini:", error);
        throw new Error(translations[language].gemini.prioritizeError);
    }
};

export const estimatePomodorosForTask = async (apiKey: string, title: string, language: 'en' | 'ja'): Promise<number> => {
    if (!apiKey) {
        throw new Error(translations[language].gemini.apiKeyError);
    }
    try {
        const ai = getAiClient(apiKey);
        const prompt = translations[language].gemini.estimatePrompt.replace('{{taskTitle}}', title);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        estimatedPomodoros: {
                            type: Type.INTEGER,
                            description: 'The estimated number of 25-minute pomodoro sessions. Must be between 1 and 5.',
                        },
                    },
                    required: ["estimatedPomodoros"],
                },
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        const pomos = result.estimatedPomodoros || 1;
        // Clamp the value to be safe, between 1 and 5.
        return Math.max(1, Math.min(5, pomos));
        
    } catch (error) {
        console.error("Error estimating pomodoros with Gemini:", error);
        throw new Error(translations[language].gemini.estimateError);
    }
};