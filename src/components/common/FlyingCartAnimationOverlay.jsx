import React from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

const dustParticlePresets = [
  { horizontalJitter: -35, verticalJitter: -20, particleSize: 6, delaySeconds: 0.08, particleColor: '#F59E0B' },
  { horizontalJitter: 25, verticalJitter: -30, particleSize: 7, delaySeconds: 0.12, particleColor: '#10B981' },
  { horizontalJitter: -18, verticalJitter: 22, particleSize: 5, delaySeconds: 0.16, particleColor: '#FBBF24' },
  { horizontalJitter: 35, verticalJitter: 15, particleSize: 6, delaySeconds: 0.2, particleColor: '#34D399' },
  { horizontalJitter: -25, verticalJitter: -35, particleSize: 6, delaySeconds: 0.24, particleColor: '#F59E0B' },
  { horizontalJitter: 20, verticalJitter: -10, particleSize: 4, delaySeconds: 0.28, particleColor: '#FFFFFF' },
  { horizontalJitter: -10, verticalJitter: 30, particleSize: 5, delaySeconds: 0.32, particleColor: '#10B981' },
  { horizontalJitter: 28, verticalJitter: 25, particleSize: 5, delaySeconds: 0.36, particleColor: '#FCD34D' }
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
        const capsuleWidth = 120;
        const capsuleHeight = 140;

        const cardCenterHorizontal = flyingAnimationItem.startingX || (flyingAnimationItem.cardStartX + flyingAnimationItem.cardWidth / 2);
        const cardCenterVertical = flyingAnimationItem.startingY || (flyingAnimationItem.cardStartY + flyingAnimationItem.cardHeight / 2);

        const capsuleOriginLeft = cardCenterHorizontal - capsuleWidth / 2;
        const capsuleOriginTop = cardCenterVertical - capsuleHeight / 2;

        const deltaHorizontal = targetCoordinateX - cardCenterHorizontal;
        const deltaVertical = targetCoordinateY - cardCenterVertical;

        const dustOriginHorizontal = cardCenterHorizontal;
        const dustOriginVertical = capsuleOriginTop + capsuleHeight * 0.7;

        const dustDeltaHorizontal = targetCoordinateX - dustOriginHorizontal;
        const dustDeltaVertical = targetCoordinateY - dustOriginVertical;

        return (
          <React.Fragment key={flyingAnimationItem.uniqueKey}>
            <div
              style={{
                left: `${capsuleOriginLeft}px`,
                top: `${capsuleOriginTop}px`,
                width: `${capsuleWidth}px`,
                height: `${capsuleHeight}px`,
                '--target-horizontal-delta': `${deltaHorizontal}px`,
                '--target-vertical-delta': `${deltaVertical}px`
              }}
              className="absolute bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-500/50 p-2 shadow-xl flex flex-col justify-between overflow-hidden animate-macGenie"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/15 via-emerald-500/10 to-transparent pointer-events-none" />

              <div className="w-full aspect-square max-h-[58%] rounded-xl bg-surface-alt overflow-hidden mb-1 relative border border-neutral-100 shadow-2xs">
                <img
                  src={flyingAnimationItem.productImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <span className="text-[8px] font-bold text-emerald-800 uppercase tracking-wider block truncate">
                    {flyingAnimationItem.productCategoryName || 'Quesería'}
                  </span>
                  <h4 className="text-[10px] font-bold text-neutral-800 truncate leading-tight">
                    {flyingAnimationItem.productTitle}
                  </h4>
                </div>

                <div className="flex items-center justify-between mt-1 pt-1 border-t border-neutral-100/80">
                  <span className="text-[11px] font-black text-neutral-900">
                    ${flyingAnimationItem.productPriceUsd?.toFixed(2)}
                  </span>
                  <span className="text-[8px] font-extrabold bg-[#114B2B] text-white px-1.5 py-0.5 rounded">
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
                    boxShadow: `0 0 8px ${particleItem.particleColor}, 0 0 2px #ffffff`,
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
