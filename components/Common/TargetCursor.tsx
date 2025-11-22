import React, { useEffect, useRef, useState } from 'react';

interface TargetCursorProps {
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  parallaxOn?: boolean;
}

export const TargetCursor: React.FC<TargetCursorProps> = ({
  spinDuration = 2,
  hideDefaultCursor = true,
  parallaxOn = true,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
      const style = document.createElement('style');
      style.id = 'cursor-style';
      style.innerHTML = `
        *, *::before, *::after { cursor: none !important; }
        input, textarea, select { cursor: text !important; }
      `;
      document.head.appendChild(style);
    }

    return () => {
      if (hideDefaultCursor) {
        document.body.style.cursor = 'auto';
        const style = document.getElementById('cursor-style');
        if (style) style.remove();
      }
    };
  }, [hideDefaultCursor]);

  useEffect(() => {
    let requestRef: number;
    let mouseX = 0;
    let mouseY = 0;
    let outerX = 0;
    let outerY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
      
      if (cursorRef.current) {
        cursorRef.current.style.left = `${mouseX}px`;
        cursorRef.current.style.top = `${mouseY}px`;
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const animate = () => {
      if (parallaxOn) {
        outerX += (mouseX - outerX) * 0.15;
        outerY += (mouseY - outerY) * 0.15;
      } else {
        outerX = mouseX;
        outerY = mouseY;
      }

      if (outerRef.current) {
        outerRef.current.style.left = `${outerX}px`;
        outerRef.current.style.top = `${outerY}px`;
      }

      requestRef = requestAnimationFrame(animate);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('.cursor-target') || 
                            target.tagName === 'BUTTON' || 
                            target.tagName === 'A' || 
                            target.tagName === 'INPUT' ||
                            target.tagName === 'TEXTAREA' ||
                            target.closest('button') ||
                            target.closest('a') ||
                            target.closest('[role="button"]');

      if (isInteractive && outerRef.current && cursorRef.current) {
        outerRef.current.style.transform = 'scale(1.5)';
        outerRef.current.style.borderColor = '#4ade80';
        cursorRef.current.style.transform = 'scale(0.5)';
      } else if (outerRef.current && cursorRef.current) {
        outerRef.current.style.transform = 'scale(1)';
        outerRef.current.style.borderColor = '#22c55e';
        cursorRef.current.style.transform = 'scale(1)';
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    requestRef = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(requestRef);
    };
  }, [parallaxOn]);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner Dot */}
      <div 
        ref={cursorRef} 
        className="fixed w-2 h-2 bg-green-500 rounded-full pointer-events-none z-[9999] transform -translate-x-1 -translate-y-1 transition-transform duration-100 ease-out"
        style={{ mixBlendMode: 'difference' }}
      />
      
      {/* Outer Target Ring */}
      <div 
        ref={outerRef}
        className="fixed w-8 h-8 border-2 border-green-600 rounded-full pointer-events-none z-[9998] transform -translate-x-4 -translate-y-4 transition-all duration-300 ease-out flex items-center justify-center"
        style={{ mixBlendMode: 'difference' }}
      >
         {/* Rotating Crosshairs */}
         <div 
            className="absolute w-full h-full border-t-2 border-b-2 border-transparent border-t-green-400/50 border-b-green-400/50 rounded-full"
            style={{ animation: `spin ${spinDuration}s linear infinite` }}
         />
         <div 
            className="absolute w-3/5 h-3/5 border-l-2 border-r-2 border-transparent border-l-green-300/40 border-r-green-300/40 rounded-full"
            style={{ animation: `spin ${spinDuration * 0.75}s linear infinite reverse` }}
         />
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
