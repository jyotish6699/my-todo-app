import { useRef } from 'react'

export const stickyColors = [
    'bg-rose-300 dark:bg-rose-600/90',
    'bg-orange-300 dark:bg-orange-600/90',
    'bg-amber-300 dark:bg-amber-600/90',
    'bg-yellow-300 dark:bg-yellow-600/90',
    'bg-lime-300 dark:bg-lime-600/90',
    'bg-emerald-300 dark:bg-emerald-600/90',
    'bg-teal-300 dark:bg-teal-600/90',
    'bg-cyan-300 dark:bg-cyan-600/90',
    'bg-sky-300 dark:bg-sky-600/90',
    'bg-indigo-300 dark:bg-indigo-600/90',
    'bg-violet-300 dark:bg-violet-600/90',
    'bg-fuchsia-300 dark:bg-fuchsia-600/90',
    'bg-pink-300 dark:bg-pink-600/90'
];

export const getColorClass = (id) => {
    return stickyColors[id ? id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % stickyColors.length : 0];
}
