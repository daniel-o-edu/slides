import { Theme } from './types';

export const THEMES: Theme[] = [
  {
    id: 'modern-dark',
    name: 'Midnight Pro',
    background: '#0f172a', // slate-900
    text: '#f8fafc', // slate-50
    accent: '#38bdf8', // sky-400
    secondary: '#1e293b', // slate-800
    font: 'Inter',
    isDark: true,
  },
  {
    id: 'clean-light',
    name: 'Clean Day',
    background: '#ffffff', // white
    text: '#1e293b', // slate-800
    accent: '#2563eb', // blue-600
    secondary: '#f1f5f9', // slate-100
    font: 'Inter',
    isDark: false,
  },
  {
    id: 'forest',
    name: 'Deep Forest',
    background: '#064e3b', // emerald-900
    text: '#ecfdf5', // emerald-50
    accent: '#34d399', // emerald-400
    secondary: '#065f46', // emerald-800
    font: 'Inter',
    isDark: true,
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    background: '#450a0a', // red-950
    text: '#fff1f2', // rose-50
    accent: '#fb7185', // rose-400
    secondary: '#7f1d1d', // red-900
    font: 'Inter',
    isDark: true,
  },
  {
    id: 'corporate',
    name: 'Corporate Blue',
    background: '#f8fafc', // slate-50
    text: '#0f172a', // slate-900
    accent: '#0f766e', // teal-700
    secondary: '#e2e8f0', // slate-200
    font: 'Inter',
    isDark: false,
  }
];

export const INITIAL_SLIDES: import('./types').Slide[] = [
  {
    title: "Welcome to AutoSlide",
    content: ["Enter your topic on the left", "Select a theme", "Click Generate to create slides"],
    type: 'title',
    notes: "This is a placeholder slide."
  }
];
