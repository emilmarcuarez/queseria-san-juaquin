import React, { useState, useEffect } from 'react';

export const InitialPageLoadingSpinner = () => {
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [shouldRenderSpinner, setShouldRenderSpinner] = useState(true);

  useEffect(() => {
    const loadingDisplayTimeout = setTimeout(() => {
      setIsLoadingComplete(true);
    }, 600);

    const removeElementTimeout = setTimeout(() => {
      setShouldRenderSpinner(false);
    }, 1100);

    return () => {
      clearTimeout(loadingDisplayTimeout);
      clearTimeout(removeElementTimeout);
    };
  }, []);

  if (!shouldRenderSpinner) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#fafafa] flex flex-col items-center justify-center transition-opacity duration-500 ${
        isLoadingComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
          <div className="w-14 h-14 rounded-full border-4 border-accent-bright/30 border-b-accent-bright animate-spin absolute" style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}></div>

          <img
            src="/images/queseria_san_juaquin_logo.png"
            alt="Quesería San Joaquín"
            className="w-12 h-12 object-contain rounded-full shadow-md absolute"
          />
        </div>

        <div className="mt-1">
          <h2 className="font-extrabold text-lg text-primary tracking-tight uppercase leading-tight">
            Quesería San Joaquín
          </h2>
          <span className="text-[10px] font-bold text-accent tracking-widest uppercase block mt-0.5">
            Mercado &amp; Charcutería
          </span>
        </div>
      </div>
    </div>
  );
};
