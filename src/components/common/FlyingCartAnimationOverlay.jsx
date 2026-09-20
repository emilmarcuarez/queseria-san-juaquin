import React from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

const dustParticlePresets = [
  { horizontalJitter: -45, verticalJitter: -25, particleSize: 8, delaySeconds: 0.12, particleColor: '#F59E0B' },
  { horizontalJitter: 35, verticalJitter: -40, particleSize: 10, delaySeconds: 0.16, particleColor: '#10B981' },
  { horizontalJitter: -20, verticalJitter: 30, particleSize: 6, delaySeconds: 0.2, particleColor: '#FBBF24' },
  { horizontalJitter: 50, verticalJitter: 20, particleSize: 7, delaySeconds: 0.24, particleColor: '#34D399' },
  { horizontalJitter: -35, verticalJitter: -50, particleSize: 9, delaySeconds: 0.28, particleColor: '#F59E0B' },
  { horizontalJitter: 25, verticalJitter: -15, particleSize: 5, delaySeconds: 0.32, particleColor: '#FFFFFF' },
  { horizontalJitter: -15, verticalJitter: 45, particleSize: 8, delaySeconds: 0.36, particleColor: '#10B981' },
  { horizontalJitter: 40, verticalJitter: -30, particleSize: 6, delaySeconds: 0.4, particleColor: '#FCD34D' },
  { horizontalJitter: -50, verticalJitter: 15, particleSize: 9, delaySeconds: 0.44, particleColor: '#059669' },
  { horizontalJitter: 15, verticalJitter: 35, particleSize: 7, delaySeconds: 0.48, particleColor: '#F59E0B' },
  { horizontalJitter: -30, verticalJitter: -20, particleSize: 5, delaySeconds: 0.52, particleColor: '#FFFFFF' },
  { horizontalJitter: 30, verticalJitter: 50, particleSize: 8, delaySeconds: 0.55, particleColor: '#10B981' }
];

export const FlyingCartAnimationOverlay = () => {
  const { flyingCartAnimationList } = useShoppingCart();

  if (!flyingCartAnimationList || flyingCartAnimationList.length === 0) {
    return null;
  }

  const getTargetCoordinates = () => {
    if (typeof window === 'undefined') {
      return { targetCoordinateX: 0, targetCoordinateY: 0 };
    }

    const mobileCartElement = document.getElementById('mobile-floating-cart-button');
    const desktopCartElement = document.getElementById('desktop-header-cart-button');

    const preferredCartElement = (window.innerWidth < 1024 ? mobileCartElement : desktopCartElement) || mobileCartElement || desktopCartElement;

    if (preferredCartElement) {
      const elementBoundingBox = preferredCartElement.getBoundingClientRect();
      return {
        targetCoordinateX: elementBoundingBox.left + elementBoundingBox.width / 2,
        targetCoordinateY: elementBoundingBox.top + elementBoundingBox.height / 2
      };
    }

    return {
      targetCoordinateX: window.innerWidth < 1024 ? window.innerWidth - 42 : window.innerWidth - 50,
      targetCoordinateY: window.innerWidth < 1024 ? window.innerHeight - 46 : 50
    };
  };

  const { targetCoordinateX, targetCoordinateY } = getTargetCoordinates();

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {flyingCartAnimationList.map((flyingAnimationItem) => {
        const cardCenterHorizontal = flyingAnimationItem.cardStartX + flyingAnimationItem.cardWidth / 2;
        const cardCenterVertical = flyingAnimationItem.cardStartY + flyingAnimationItem.cardHeight / 2;

        const deltaHorizontal = targetCoordinateX - cardCenterHorizontal;
        const deltaVertical = targetCoordinateY - cardCenterVertical;

        const dustOriginHorizontal = cardCenterHorizontal;
        const dustOriginVertical = flyingAnimationItem.cardStartY + flyingAnimationItem.cardHeight * 0.7;

        const dustDeltaHorizontal = targetCoordinateX - dustOriginHorizontal;
        const dustDeltaVertical = targetCoordinateY - dustOriginVertical;

        return (
          <React.Fragment key={flyingAnimationItem.uniqueKey}>
            <div
              style={{
                left: `${flyingAnimationItem.cardStartX}px`,
                top: `${flyingAnimationItem.cardStartY}px`,
                width: `${flyingAnimationItem.cardWidth}px`,
                height: `${flyingAnimationItem.cardHeight}px`,
                '--target-horizontal-delta': `${deltaHorizontal}px`,
                '--target-vertical-delta': `${deltaVertical}px`
              }}
              className="absolute bg-white/95 rounded-2xl border-2 border-emerald-500/80 p-3 shadow-2xl flex flex-col justify-between overflow-hidden animate-macGenie"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-emerald-500/15 to-transparent pointer-events-none" />

              <div className="w-full aspect-square max-h-[55%] rounded-xl bg-surface-alt overflow-hidden mb-1 relative border border-neutral-100">
                <img
                  src={flyingAnimationItem.productImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block truncate">
                    {flyingAnimationItem.productCategoryName || 'Quesería'}
                  </span>
                  <h4 className="text-[11px] font-bold text-neutral-900 truncate leading-tight">
                    {flyingAnimationItem.productTitle}
                  </h4>
                </div>

                <div className="flex items-center justify-between mt-1 pt-1 border-t border-neutral-100">
                  <span className="text-xs font-black text-neutral-900">
                    ${flyingAnimationItem.productPriceUsd?.toFixed(2)}
                  </span>
                  <span className="text-[9px] font-extrabold bg-[#114B2B] text-white px-2 py-0.5 rounded-md">
                    +1
                  </span>
                </div>
              </div>
            </div>

            {dustParticlePresets.map((particleItem, particleIndex) => {
              const particleKey = `${flyingAnimationItem.uniqueKey}_particle_${particleIndex}`;

              return (
                <div
                  key={particleKey}
                  style={{
                    left: `${dustOriginHorizontal}px`,
                    top: `${dustOriginVertical}px`,
                    width: `${particleItem.particleSize}px`,
                    height: `${particleItem.particleSize}px`,
                    backgroundColor: particleItem.particleColor,
                    boxShadow: `0 0 10px ${particleItem.particleColor}, 0 0 4px #ffffff`,
                    animationDelay: `${particleItem.delaySeconds}s`,
                    '--dust-delta-horizontal': `${dustDeltaHorizontal}px`,
                    '--dust-delta-vertical': `${dustDeltaVertical}px`,
                    '--dust-jitter-x': `${particleItem.horizontalJitter}px`,
                    '--dust-jitter-y': `${particleItem.verticalJitter}px`
                  }}
                  className="absolute rounded-full pointer-events-none animate-genieDust"
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};
