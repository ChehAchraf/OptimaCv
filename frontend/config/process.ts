import { StepItem } from "@/types/type";
import {
    HiDocumentArrowUp,
    HiClipboardDocumentList,
    HiPhoto,
    HiSparkles
} from 'react-icons/hi2';

export const steps: StepItem[] = [
    {
        number: 1,
        title: 'steps.upload.title',
        description: 'steps.upload.description',
        icon: HiDocumentArrowUp,
        iconBg: 'bg-gray-900 dark:bg-gray-100',
        iconColor: 'text-white dark:text-gray-900',
        delay: 0.1,
    },
    {
        number: 2,
        title: 'steps.paste.title',
        description: 'steps.paste.description',
        icon: HiClipboardDocumentList,
        iconBg: 'bg-gray-800 dark:bg-gray-200',
        iconColor: 'text-white dark:text-gray-900',
        delay: 0.2,
    },
    {
        number: 3,
        title: 'steps.visual.title',
        description: 'steps.visual.description',
        icon: HiPhoto,
        iconBg: 'bg-gray-700 dark:bg-gray-300',
        iconColor: 'text-white dark:text-gray-900',
        delay: 0.3,
    },
    {
        number: 4,
        title: 'steps.results.title',
        description: 'steps.results.description',
        icon: HiSparkles,
        iconBg: 'bg-gray-900 dark:bg-gray-100',
        iconColor: 'text-white dark:text-gray-900',
        delay: 0.4,
    },
];
