import React, { useState, useEffect } from 'react';

export const InitialPageLoadingSpinner = () => {
  const [deliveryProgressPercentage, setDeliveryProgressPercentage] = useState(0);
  const [isSpinnerFadingOut, setIsSpinnerFadingOut] = useState(false);
  const [shouldRenderSpinner, setShouldRenderSpinner] = useState(true);

  useEffect(() => {
    let animationFrameHandle;
    const animationDurationMs = 1500;
    const animationStartTimestamp = performance.now();

    const processProgressAnimationStep = (currentTimestamp) => {
      const elapsedMilliseconds = currentTimestamp - animationStartTimestamp;
      const linearProgressFraction = Math.min(elapsedMilliseconds / animationDurationMs, 1);

      const smoothEasedFraction = linearProgressFraction < 0.5
        ? 2 * linearProgressFraction * linearProgressFraction
        : 1 - Math.pow(-2 * linearProgressFraction + 2, 2) / 2;

      setDeliveryProgressPercentage(smoothEasedFraction * 100);

      if (linearProgressFraction < 1) {
        animationFrameHandle = requestAnimationFrame(processProgressAnimationStep);
      } else {
        setTimeout(() => {
          setIsSpinnerFadingOut(true);
        }, 180);
        setTimeout(() => {
          setShouldRenderSpinner(false);
        }, 500);
      }
    };

    animationFrameHandle = requestAnimationFrame(processProgressAnimationStep);

    return () => {
      cancelAnimationFrame(animationFrameHandle);
    };
  }, []);

  if (!shouldRenderSpinner) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 bg-white flex flex-col items-center justify-center select-none transition-opacity duration-300 ${
        isSpinnerFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="relative flex items-center justify-center px-6">
        <div className="relative w-64 sm:w-80 md:w-96 h-2.5 rounded-full bg-neutral-100 border border-neutral-200/90 overflow-visible flex items-center">
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-0 border-t border-dashed border-neutral-300 pointer-events-none" />

          <div
            className="absolute left-0 top-0 bottom-0 rounded-full bg-gradient-to-r from-[#8DC63F] to-[#78AD2F] transition-all duration-75"
            style={{ width: `${deliveryProgressPercentage}%` }}
          />

          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-75 pointer-events-none"
            style={{
              left: `calc(${deliveryProgressPercentage}% - 24px)`
            }}
          >
            <div className="relative -mt-9 animate-bounce" style={{ animationDuration: '0.28s' }}>
              <svg
                viewBox="0 0 64 64"
                className="w-14 h-14 filter drop-shadow-md"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="16" cy="46" r="8.5" fill="#1F2937" />
                <circle cx="16" cy="46" r="4" fill="#E5E7EB" />
                <circle cx="16" cy="46" r="1.8" fill="#1F2937" />

                <circle cx="48" cy="46" r="8.5" fill="#1F2937" />
                <circle cx="48" cy="46" r="4" fill="#E5E7EB" />
                <circle cx="48" cy="46" r="1.8" fill="#1F2937" />

                <path
                  d="M16 46 L26 44 L36 44 L44 32 L48 46"
                  stroke="#062612"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <path d="M26 44 L38 44 L44 30 L40 26 L30 26 Z" fill="#0B3C1D" />

                <path
                  d="M42 26 L48 30 L44 42"
                  stroke="#8DC63F"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                <path
                  d="M40 26 L38 20 L44 19"
                  stroke="#1F2937"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                <circle cx="45" cy="22" r="2.8" fill="#FEF08A" />
                <path
                  d="M47 22 L60 17 L60 27 Z"
                  fill="#FEF08A"
                  opacity="0.4"
                />

                <rect
                  x="10"
                  y="20"
                  width="16"
                  height="18"
                  rx="3"
                  fill="#8DC63F"
                  stroke="#78AD2F"
                  strokeWidth="1.5"
                />
                <rect
                  x="12"
                  y="27"
                  width="12"
                  height="4"
                  rx="1"
                  fill="#062612"
                  opacity="0.85"
                />

                <path d="M25 36 L30 24 L36 28 L34 38 Z" fill="#062612" />
                <path
                  d="M30 25 L38 22"
                  stroke="#062612"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <circle
                  cx="30"
                  cy="15"
                  r="7.5"
                  fill="#8DC63F"
                  stroke="#78AD2F"
                  strokeWidth="1"
                />
                <path d="M32 14 Q36 15 36 17 L31 18 Z" fill="#062612" />

                <path
                  d="M4 38 L1 38"
                  stroke="#8DC63F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.75"
                />
                <path
                  d="M6 44 L2 44"
                  stroke="#8DC63F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
