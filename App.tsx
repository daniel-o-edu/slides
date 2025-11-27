import React, { useState, useRef } from 'react';
import { PresentationData, Slide, Theme, GenerationStatus } from './types';
import { THEMES, INITIAL_SLIDES } from './constants';
import { generateSlidesFromText } from './services/geminiService';
import { generateHTMLContent, downloadHTML, downloadPDF } from './services/pdfService';
import { SlideRenderer } from './components/SlideRenderer';
import { 
  Presentation, 
  Download, 
  FileCode, 
  Loader2, 
  Palette, 
  Wand2,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';

const App: React.FC = () => {
  // Model / State
  const [textInput, setTextInput] = useState<string>('');
  const [slides, setSlides] = useState<Slide[]>(INITIAL_SLIDES);
  const [topic, setTopic] = useState<string>('My Presentation');
  const [currentTheme, setCurrentTheme] = useState<Theme>(THEMES[0]);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Controller Actions
  const handleGenerate = async () => {
    if (!textInput.trim()) return;
    
    setStatus('generating');
    try {
      const data: PresentationData = await generateSlidesFromText(textInput);
      setSlides(data.slides);
      setTopic(data.topic);
      setStatus('success');
      setCurrentSlideIndex(0);
    } catch (e) {
      setStatus('error');
      alert('Failed to generate slides. Please check your API key or try again.');
    }
  };

  const handleDownloadHTML = () => {
    const htmlContent = generateHTMLContent(slides, currentTheme, topic);
    downloadHTML(`${topic.replace(/\s+/g, '_')}.html`, htmlContent);
  };

  const handleDownloadPDF = async () => {
    setStatus('generating'); // Re-use loading state for PDF gen visual feedback
    try {
      // Small delay to ensure DOM render before capture
      await new Promise(r => setTimeout(r, 100)); 
      await downloadPDF(topic);
      setStatus('success');
    } catch (e) {
      console.error(e);
      alert('Error generating PDF');
      setStatus('error');
    }
  };

  const nextSlide = () => setCurrentSlideIndex(prev => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlideIndex(prev => Math.max(prev - 1, 0));

  // View
  return (
    <div className={`flex h-screen w-full overflow-hidden bg-gray-100 font-sans transition-colors duration-500 ${currentTheme.isDark ? 'dark' : ''}`}>
      
      {/* --- Sidebar (Input & Controls) --- */}
      <div 
        className={`${
          isSidebarOpen ? 'w-full md:w-96' : 'w-0'
        } bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-20 shadow-xl relative`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Presentation size={24} />
            <h1 className="font-bold text-xl tracking-tight">AutoSlide</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-500">
            <ChevronLeft />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Topic Input */}
          <section>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Wand2 size={16} />
              Input Content / Topic
            </label>
            <textarea
              className="w-full h-40 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-sm leading-relaxed"
              placeholder="e.g., Explain the water cycle for 5th graders..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={status === 'generating' || !textInput.trim()}
              className="mt-4 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === 'generating' ? <Loader2 className="animate-spin" /> : <Wand2 size={18} />}
              Generate Slides
            </button>
          </section>

          {/* Theme Selector */}
          <section>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Palette size={16} />
              Select Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => setCurrentTheme(theme)}
                  className={`relative p-3 rounded-lg border-2 text-left transition-all overflow-hidden group ${
                    currentTheme.id === theme.id ? 'border-indigo-600 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{backgroundColor: theme.accent}}></div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full border shadow-sm" style={{backgroundColor: theme.background}}></div>
                    <div className="w-4 h-4 rounded-full shadow-sm" style={{backgroundColor: theme.accent}}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-800">{theme.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Export Actions */}
          <section>
             <label className="block text-sm font-medium text-gray-700 mb-3">Export</label>
             <div className="grid grid-cols-2 gap-3">
               <button 
                 onClick={handleDownloadPDF}
                 className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-indigo-600 transition-colors gap-2"
               >
                 <Download size={20} />
                 <span className="text-xs font-medium">Download PDF</span>
               </button>
               <button 
                 onClick={handleDownloadHTML}
                 className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:text-indigo-600 transition-colors gap-2"
               >
                 <FileCode size={20} />
                 <span className="text-xs font-medium">Download HTML</span>
               </button>
             </div>
          </section>
        </div>
      </div>

      {/* --- Main Preview Area --- */}
      <div className="flex-1 flex flex-col h-full bg-slate-200 relative">
        {/* Mobile Toggle */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 p-2 bg-white rounded-md shadow-md"
          >
            <ChevronRight />
          </button>
        )}

        {/* Toolbar */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
           <div className="font-semibold text-gray-700 truncate max-w-md">{topic}</div>
           <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{slides.length} Slides</span>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex gap-1">
                 <button onClick={prevSlide} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={20} /></button>
                 <span className="min-w-[3rem] text-center font-mono">{currentSlideIndex + 1} / {slides.length}</span>
                 <button onClick={nextSlide} className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={20} /></button>
              </div>
           </div>
        </div>

        {/* Slide Stage */}
        <div className="flex-1 overflow-hidden flex items-center justify-center p-4 md:p-12">
            <div className="w-full max-w-4xl shadow-2xl rounded-sm ring-1 ring-black/5">
               <SlideRenderer 
                  slide={slides[currentSlideIndex]} 
                  theme={currentTheme}
                  pageNumber={currentSlideIndex + 1}
                  totalPages={slides.length}
               />
            </div>
        </div>

        {/* Hidden Container for PDF Generation (Renders all slides at once off-screen) */}
        <div className="absolute top-0 left-0 w-[800px] pointer-events-none opacity-0 -z-50">
          {slides.map((slide, idx) => (
            <div key={idx} className="printable-slide mb-10">
              <SlideRenderer 
                slide={slide} 
                theme={currentTheme}
                pageNumber={idx + 1}
                totalPages={slides.length}
                // Force fixed width for consistency during PDF generation
                className="!w-[800px] !h-[600px]" 
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default App;
