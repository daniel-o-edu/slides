import React from 'react';
import { Slide, Theme } from '../types';
import { Quote, List, Type } from 'lucide-react';

interface SlideRendererProps {
  slide: Slide;
  theme: Theme;
  pageNumber: number;
  totalPages: number;
  id?: string;
  className?: string;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({ 
  slide, 
  theme, 
  pageNumber, 
  totalPages,
  id,
  className = ""
}) => {
  
  // Style object based on theme
  const slideStyle = {
    backgroundColor: theme.background,
    color: theme.text,
  };

  const accentStyle = {
    color: theme.accent
  };

  const renderContent = () => {
    if (slide.type === 'title') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-12">
           <div className="mb-6 opacity-80">
              <Type size={48} color={theme.accent} />
           </div>
           <h1 className="text-5xl font-bold mb-6" style={accentStyle}>{slide.title}</h1>
           <div className="text-xl opacity-80 max-w-2xl">
              {slide.content.map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
           </div>
        </div>
      );
    }

    if (slide.type === 'summary') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-12 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-32 h-32 opacity-10 rounded-br-full" style={{backgroundColor: theme.accent}}></div>
           <Quote size={40} className="mb-4 opacity-50" color={theme.accent} />
           <h2 className="text-4xl font-bold mb-8" style={accentStyle}>{slide.title}</h2>
           <div className="text-2xl font-light space-y-4">
              {slide.content.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
           </div>
        </div>
      );
    }

    // Default 'content' slide
    return (
      <div className="flex flex-col h-full p-12">
        <div className="flex items-center mb-8 border-b pb-4" style={{borderColor: theme.secondary}}>
           <h2 className="text-4xl font-bold" style={accentStyle}>{slide.title}</h2>
        </div>
        <div className="flex-grow text-2xl">
          <ul className="space-y-4">
            {slide.content.map((point, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-4 mt-1.5 transform scale-75 opacity-70">
                   <List size={24} color={theme.accent} />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div 
      id={id}
      className={`aspect-[4/3] w-full shadow-2xl relative overflow-hidden select-none transition-colors duration-300 ${className}`}
      style={slideStyle}
    >
      {/* Decorative accent bar based on theme */}
      <div className="absolute top-0 right-0 w-2 h-full opacity-20" style={{backgroundColor: theme.accent}}></div>
      
      {renderContent()}

      {/* Footer / Page Number */}
      <div className="absolute bottom-4 right-6 text-sm opacity-50 font-mono">
        {pageNumber} / {totalPages}
      </div>
    </div>
  );
};
