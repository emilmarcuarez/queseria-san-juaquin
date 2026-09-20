import React from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const FlyingCartAnimationOverlay = () => {
  const { flyingCartAnimationList } = useShoppingCart();

  if (!flyingCartAnimationList || flyingCartAnimationList.length === 0) {
    return null;
  }

  const targetCoordinateX = typeof window !== 'undefined'
    ? (window.innerWidth < 1024 ? window.innerWidth - 40 : window.innerWidth - 48)
    : 0;

  const targetCoordinateY = typeof window !== 'undefined'
    ? (window.innerWidth < 1024 ? window.innerHeight - 44 : window.innerHeight - 48)
    : 0;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {flyingCartAnimationList.map((flyingAnimationItem) => {
        const deltaHorizontal = targetCoordinateX - flyingAnimationItem.startingX;
        const deltaVertical = targetCoordinateY - flyingAnimationItem.startingY;

        return (
          <div
            key={flyingAnimationItem.uniqueKey}
            style={{
              left: `${flyingAnimationItem.startingX}px`,
              top: `${flyingAnimationItem.startingY}px`,
              '--target-horizontal-delta': `${deltaHorizontal}px`,
              '--target-vertical-delta': `${deltaVertical}px`
            }}
            className="absolute w-12 h-12 rounded-full p-1 bg-white border-2 border-emerald-500 shadow-2xl overflow-hidden flex items-center justify-center animate-flyToCart"
          >
            <img
              src={flyingAnimationItem.productImage}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        );
      })}
    </div>
  );
};
