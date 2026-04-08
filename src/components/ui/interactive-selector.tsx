"use client";

import React, { useState, useEffect } from "react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export interface SelectorOption {
  title: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}

interface InteractiveSelectorProps {
  title: string;
  description: string;
  options: SelectorOption[];
}

export const InteractiveSelector = ({ title, description, options }: InteractiveSelectorProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animatedOptions, setAnimatedOptions] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i]);
      }, 150 * i);
      timers.push(timer);
    });
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [options]);

  return (
    <div className="relative flex flex-col items-center justify-center py-24 bg-transparent font-sans text-white"> 
      
      {/* Header Section */}
      <div className="w-full max-w-3xl px-6 mb-12 text-center">
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">{title}</h2>
          <p className="text-lg md:text-xl text-gray-400 font-medium max-w-2xl mx-auto">{description}</p>
        </AnimatedSection>
      </div>

      {/* Options Container */}
      <div className="flex w-full max-w-[1200px] h-[400px] md:h-[500px] mx-auto px-4 md:px-6 overflow-hidden gap-2 md:gap-4 relative">
        {options.map((option, index) => {
          const isActive = activeIndex === index;
          const isAnimated = animatedOptions.includes(index);

          return (
            <div
              key={index}
              className={`
                relative flex flex-col justify-end overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer rounded-3xl md:rounded-[2rem] border-2
                ${isActive ? 'border-white/50 shadow-[0_0_40px_rgba(255,255,255,0.2)] flex-[6] md:flex-[7]' : 'border-white/10 flex-[1] hover:flex-[1.5]'}
              `}
              style={{
                backgroundImage: `url('${option.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: isAnimated ? 1 : 0,
                transform: isAnimated ? 'translateX(0)' : 'translateX(-40px)',
              }}
              onClick={() => handleOptionClick(index)}
            >
              {/* Dark Gradient Overlay for text readability */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none transition-opacity duration-700"
                style={{ opacity: isActive ? 0.8 : 0.4 }}
              />
              
              {/* Bottom Label Container */}
              <div className="absolute left-0 right-0 bottom-4 md:bottom-6 flex items-center h-16 px-3 md:px-6 gap-3 md:gap-4 w-full z-10 pointer-events-none">
                
                {/* Icon Wrapper */}
                <div className="min-w-[40px] md:min-w-[50px] h-[40px] md:h-[50px] flex items-center justify-center rounded-full bg-white/10 backdrop-blur-xl shadow-lg border border-white/20 shrink-0 text-white transition-transform duration-500">
                  {option.icon}
                </div>
                
                {/* Text Info */}
                <div 
                  className={`text-white whitespace-nowrap overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                >
                  <div className="font-bold text-lg md:text-2xl mb-1">{option.title}</div>
                  <div className="text-xs md:text-base text-gray-300 truncate">{option.description}</div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveSelector;
