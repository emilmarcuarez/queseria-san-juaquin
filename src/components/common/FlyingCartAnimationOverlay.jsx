import React, { useRef, useEffect } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

const clampValue = (currentValue, minimumBound, maximumBound) => {
  return Math.max(minimumBound, Math.min(maximumBound, currentValue));
};

const linearInterpolate = (startValue, endValue, factorRatio) => {
  return startValue + (endValue - startValue) * factorRatio;
};

const easeInOutCubicCurve = (normalizedProgress) => {
  return normalizedProgress < 0.5
    ? 4 * normalizedProgress * normalizedProgress * normalizedProgress
    : 1 - Math.pow(-2 * normalizedProgress + 2, 3) / 2;
};

const easeInQuadCurve = (normalizedProgress) => {
  return normalizedProgress * normalizedProgress;
};

const easeOutQuadCurve = (normalizedProgress) => {
  return 1 - (1 - normalizedProgress) * (1 - normalizedProgress);
};

export const FlyingCartAnimationOverlay = () => {
  const { flyingCartAnimationList } = useShoppingCart();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!flyingCartAnimationList || flyingCartAnimationList.length === 0) {
      return;
    }

    const currentAnimationItem = flyingCartAnimationList[0];
    const canvasElement = canvasRef.current;
    if (!canvasElement) {
      return;
    }

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    canvasElement.width = screenWidth;
    canvasElement.height = screenHeight;

    const canvasContext = canvasElement.getContext('2d');
    if (!canvasContext) {
      return;
    }

    const mobileCartElement = document.getElementById('mobile-floating-cart-button');
    const desktopCartElement = document.getElementById('desktop-header-cart-button');
    const targetCartElement = (screenWidth < 1024 ? mobileCartElement : desktopCartElement) || mobileCartElement || desktopCartElement;

    let dockTargetX = screenWidth < 1024 ? screenWidth - 42 : screenWidth - 50;
    let dockTargetY = screenWidth < 1024 ? screenHeight - 46 : 50;

    if (targetCartElement) {
      const targetBoundingBox = targetCartElement.getBoundingClientRect();
      dockTargetX = targetBoundingBox.left + targetBoundingBox.width / 2;
      dockTargetY = targetBoundingBox.top + targetBoundingBox.height / 2;
    }

    const windowStartLeft = currentAnimationItem.cardStartX || (currentAnimationItem.startingX - 110);
    const windowStartTop = currentAnimationItem.cardStartY || (currentAnimationItem.startingY - 140);
    const windowWidth = currentAnimationItem.cardWidth || 220;
    const windowHeight = currentAnimationItem.cardHeight || 280;

    const offscreenWidth = 240;
    const offscreenHeight = 300;
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = offscreenWidth;
    offscreenCanvas.height = offscreenHeight;
    const offscreenContext = offscreenCanvas.getContext('2d');

    const drawCardVisuals = (loadedImageElement) => {
      if (!offscreenContext) {
        return;
      }
      offscreenContext.clearRect(0, 0, offscreenWidth, offscreenHeight);

      offscreenContext.save();
      offscreenContext.beginPath();
      offscreenContext.roundRect(0, 0, offscreenWidth, offscreenHeight, 18);
      offscreenContext.fillStyle = '#FFFFFF';
      offscreenContext.fill();
      offscreenContext.lineWidth = 3;
      offscreenContext.strokeStyle = '#10B981';
      offscreenContext.stroke();
      offscreenContext.clip();

      const imageMargin = 12;
      const imageDisplayWidth = offscreenWidth - imageMargin * 2;
      const imageDisplayHeight = offscreenHeight * 0.54;

      if (loadedImageElement) {
        offscreenContext.save();
        offscreenContext.beginPath();
        offscreenContext.roundRect(imageMargin, imageMargin, imageDisplayWidth, imageDisplayHeight, 12);
        offscreenContext.clip();
        offscreenContext.drawImage(loadedImageElement, imageMargin, imageMargin, imageDisplayWidth, imageDisplayHeight);
        offscreenContext.restore();
      } else {
        offscreenContext.fillStyle = '#F3F4F6';
        offscreenContext.fillRect(imageMargin, imageMargin, imageDisplayWidth, imageDisplayHeight);
      }

      const categoryTop = imageMargin + imageDisplayHeight + 20;
      offscreenContext.fillStyle = '#114B2B';
      offscreenContext.font = 'bold 10px system-ui, -apple-system, sans-serif';
      offscreenContext.fillText((currentAnimationItem.productCategoryName || 'QUESERÍA').toUpperCase(), imageMargin, categoryTop);

      const titleTop = categoryTop + 18;
      offscreenContext.fillStyle = '#111827';
      offscreenContext.font = 'bold 12px system-ui, -apple-system, sans-serif';
      const truncatedTitle = currentAnimationItem.productTitle && currentAnimationItem.productTitle.length > 26
        ? `${currentAnimationItem.productTitle.slice(0, 24)}...`
        : (currentAnimationItem.productTitle || '');
      offscreenContext.fillText(truncatedTitle, imageMargin, titleTop);

      const priceTop = offscreenHeight - 16;
      offscreenContext.fillStyle = '#111827';
      offscreenContext.font = '900 15px system-ui, -apple-system, sans-serif';
      offscreenContext.fillText(`$${(currentAnimationItem.productPriceUsd || 0).toFixed(2)}`, imageMargin, priceTop);

      offscreenContext.restore();
    };

    let animationFrameHandle = 0;
    let animationStartTime = 0;
    const animationTotalDurationMs = 560;

    const renderScanlineGenieFrame = (currentTimestamp) => {
      if (!animationStartTime) {
        animationStartTime = currentTimestamp;
      }

      const elapsedMilliseconds = currentTimestamp - animationStartTime;
      const animationProgress = clampValue(elapsedMilliseconds / animationTotalDurationMs, 0, 1);

      canvasContext.clearRect(0, 0, screenWidth, screenHeight);

      const totalScanlines = 80;
      const scanlineStepPixels = windowHeight / totalScanlines;

      for (let scanlineIndex = 0; scanlineIndex < totalScanlines; scanlineIndex++) {
        const rowRatio = scanlineIndex / totalScanlines;

        const rowXStart = (1 - rowRatio) * 0.65;
        const progressHorizontal = clampValue((animationProgress - rowXStart) / (1 - rowXStart), 0, 1);
        const easedHorizontal = easeInOutCubicCurve(progressHorizontal);

        const rowYStart = (1 - rowRatio) * 0.22;
        const progressVertical = clampValue((animationProgress - rowYStart) / (1 - rowYStart), 0, 1);
        const easedVertical = easeInQuadCurve(progressVertical);

        const leftEdge = linearInterpolate(windowStartLeft, dockTargetX, easedHorizontal);
        const rightEdge = linearInterpolate(windowStartLeft + windowWidth, dockTargetX, easedHorizontal);
        const destinationY = linearInterpolate(windowStartTop + rowRatio * windowHeight, dockTargetY, easedVertical);
        const destinationWidth = rightEdge - leftEdge;

        if (destinationWidth < 0.8) {
          continue;
        }

        const sourceSliceY = rowRatio * offscreenHeight;
        const sourceSliceHeight = (1 / totalScanlines) * offscreenHeight;

        canvasContext.drawImage(
          offscreenCanvas,
          0,
          sourceSliceY,
          offscreenWidth,
          sourceSliceHeight,
          leftEdge,
          destinationY,
          destinationWidth,
          scanlineStepPixels + 0.6
        );
      }

      if (animationProgress > 0.7) {
        const glowOpacityRatio = easeOutQuadCurve((animationProgress - 0.7) / 0.3) * 0.45;
        const radialGradientGlow = canvasContext.createRadialGradient(
          dockTargetX,
          dockTargetY,
          2,
          dockTargetX,
          dockTargetY,
          65
        );
        radialGradientGlow.addColorStop(0, `rgba(16, 185, 129, ${glowOpacityRatio})`);
        radialGradientGlow.addColorStop(0.5, `rgba(245, 158, 11, ${glowOpacityRatio * 0.5})`);
        radialGradientGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');

        canvasContext.fillStyle = radialGradientGlow;
        canvasContext.beginPath();
        canvasContext.arc(dockTargetX, dockTargetY, 65, 0, Math.PI * 2);
        canvasContext.fill();
      }

      if (animationProgress < 1) {
        animationFrameHandle = requestAnimationFrame(renderScanlineGenieFrame);
      } else {
        canvasContext.clearRect(0, 0, screenWidth, screenHeight);
      }
    };

    const productImageElement = new Image();
    productImageElement.crossOrigin = 'anonymous';
    productImageElement.onload = () => {
      drawCardVisuals(productImageElement);
      animationFrameHandle = requestAnimationFrame(renderScanlineGenieFrame);
    };
    productImageElement.onerror = () => {
      drawCardVisuals(null);
      animationFrameHandle = requestAnimationFrame(renderScanlineGenieFrame);
    };
    productImageElement.src = currentAnimationItem.productImage;

    if (productImageElement.complete && productImageElement.naturalWidth > 0) {
      drawCardVisuals(productImageElement);
      animationFrameHandle = requestAnimationFrame(renderScanlineGenieFrame);
    }

    return () => {
      if (animationFrameHandle) {
        cancelAnimationFrame(animationFrameHandle);
      }
    };
  }, [flyingCartAnimationList]);

  if (!flyingCartAnimationList || flyingCartAnimationList.length === 0) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
    />
  );
};
