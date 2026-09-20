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
        const previewSize = 48;
        const originCenterX = flyingAnimationItem.startingX || (flyingAnimationItem.cardStartX + flyingAnimationItem.cardWidth / 2);
        const originCenterY = flyingAnimationItem.startingY || (flyingAnimationItem.cardStartY + flyingAnimationItem.cardHeight / 2);

        const originLeft = originCenterX - previewSize / 2;
        const originTop = originCenterY - previewSize / 2;

        const deltaHorizontal = targetCoordinateX - originCenterX;
        const deltaVertical = targetCoordinateY - originCenterY;

        return (
          <div
            key={flyingAnimationItem.uniqueKey}
            style={{
              left: `${originLeft}px`,
              top: `${originTop}px`,
              width: `${previewSize}px`,
              height: `${previewSize}px`,
              '--target-horizontal-delta': `${deltaHorizontal}px`,
              '--target-vertical-delta': `${deltaVertical}px`
            }}
            className="absolute rounded-full border-2 border-white shadow-xl bg-white overflow-hidden p-0.5 flex items-center justify-center animate-macAppleGlide"
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
