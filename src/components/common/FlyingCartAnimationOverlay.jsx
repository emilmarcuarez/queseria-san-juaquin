import React from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

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
            className="absolute w-14 h-14 p-1 rounded-2xl bg-white border-2 border-emerald-500 shadow-2xl overflow-hidden flex items-center justify-center animate-aladdinGenie"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-emerald-500/20 to-transparent pointer-events-none" />
            <img
              src={flyingAnimationItem.productImage}
              alt=""
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        );
      })}
    </div>
  );
};
