export interface Slide {
  title: string;
  content: string[];
  type: 'title' | 'content' | 'summary';
  notes?: string;
}

export interface PresentationData {
  topic: string;
  slides: Slide[];
}

export interface Theme {
  id: string;
  name: string;
  background: string;
  text: string;
  accent: string;
  secondary: string;
  font: string;
  isDark: boolean;
}

export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';
