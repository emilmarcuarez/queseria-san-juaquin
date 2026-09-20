import React, { useRef, useEffect } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

const clampNumericValue = (currentValue, minimumBound, maximumBound) => {
  return Math.max(minimumBound, Math.min(maximumBound, currentValue));
};

const linearInterpolateValue = (startValue, endValue, factorRatio) => {
  return startValue + (endValue - startValue) * factorRatio;
};

const easeInOutCubicProgress = (normalizedProgress) => {
  return normalizedProgress < 0.5
    ? 4 * normalizedProgress * normalizedProgress * normalizedProgress
    : 1 - Math.pow(-2 * normalizedProgress + 2, 3) / 2;
};

const easeInQuadProgress = (normalizedProgress) => {
  return normalizedProgress * normalizedProgress;
};

const easeOutQuadProgress = (normalizedProgress) => {
  return 1 - (1 - normalizedProgress) * (1 - normalizedProgress);
};

const renderWrappedTextLines = (canvasContext, textContent, horizontalPosition, verticalPosition, maximumWidth, lineHeightPixels, maximumLinesAllowed = 2) => {
  const wordsList = (textContent || '').split(' ');
  let currentLineText = '';
  let renderedLinesCount = 0;
  let currentVerticalPosition = verticalPosition;

  for (const wordToken of wordsList) {
    const testLineCandidate = currentLineText ? `${currentLineText} ${wordToken}` : wordToken;
    const testLineMetrics = canvasContext.measureText(testLineCandidate);
    if (testLineMetrics.width > maximumWidth && currentLineText) {
      canvasContext.fillText(currentLineText, horizontalPosition, currentVerticalPosition);
      currentLineText = wordToken;
      currentVerticalPosition += lineHeightPixels;
      renderedLinesCount += 1;
      if (renderedLinesCount >= maximumLinesAllowed - 1) {
        break;
      }
    } else {
      currentLineText = testLineCandidate;
    }
  }

  if (currentLineText && renderedLinesCount < maximumLinesAllowed) {
    canvasContext.fillText(currentLineText, horizontalPosition, currentVerticalPosition);
  }

  return currentVerticalPosition + lineHeightPixels;
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

    const screenDimensionWidth = window.innerWidth;
    const screenDimensionHeight = window.innerHeight;
    canvasElement.width = screenDimensionWidth;
    canvasElement.height = screenDimensionHeight;

    const mainCanvasContext = canvasElement.getContext('2d');
    if (!mainCanvasContext) {
      return;
    }

    const mobileCartElement = document.getElementById('mobile-floating-cart-button');
    const desktopCartElement = document.getElementById('desktop-header-cart-button');
    const targetCartElement = (screenDimensionWidth < 1024 ? mobileCartElement : desktopCartElement) || mobileCartElement || desktopCartElement;

    let dockTargetCoordinateX = screenDimensionWidth < 1024 ? screenDimensionWidth - 42 : screenDimensionWidth - 50;
    let dockTargetCoordinateY = screenDimensionWidth < 1024 ? screenDimensionHeight - 46 : 50;

    if (targetCartElement) {
      const targetBoundingBox = targetCartElement.getBoundingClientRect();
      dockTargetCoordinateX = targetBoundingBox.left + targetBoundingBox.width / 2;
      dockTargetCoordinateY = targetBoundingBox.top + targetBoundingBox.height / 2;
    }

    const windowStartLeftCoordinate = currentAnimationItem.cardStartX || (currentAnimationItem.startingX - 110);
    const windowStartTopCoordinate = currentAnimationItem.cardStartY || (currentAnimationItem.startingY - 140);
    const windowDimensionWidth = currentAnimationItem.cardWidth || 220;
    const windowDimensionHeight = currentAnimationItem.cardHeight || 310;

    const offscreenCanvasWidth = Math.max(240, Math.round(windowDimensionWidth));
    const offscreenCanvasHeight = Math.max(340, Math.round(windowDimensionHeight));
    const offscreenCanvasElement = document.createElement('canvas');
    offscreenCanvasElement.width = offscreenCanvasWidth;
    offscreenCanvasElement.height = offscreenCanvasHeight;
    const offscreenContext = offscreenCanvasElement.getContext('2d');

    const drawCompleteCardReplica = (loadedImageElement) => {
      if (!offscreenContext) {
        return;
      }
      offscreenContext.clearRect(0, 0, offscreenCanvasWidth, offscreenCanvasHeight);

      offscreenContext.save();
      offscreenContext.beginPath();
      offscreenContext.roundRect(0, 0, offscreenCanvasWidth, offscreenCanvasHeight, 16);
      offscreenContext.fillStyle = '#FFFFFF';
      offscreenContext.fill();
      offscreenContext.lineWidth = 1.5;
      offscreenContext.strokeStyle = 'rgba(229, 231, 235, 0.95)';
      offscreenContext.stroke();
      offscreenContext.clip();

      const cardPaddingPixels = 12;
      const contentInnerWidth = offscreenCanvasWidth - cardPaddingPixels * 2;
      const imageDisplayHeight = Math.min(contentInnerWidth, Math.round(offscreenCanvasHeight * 0.42));

      if (loadedImageElement) {
        offscreenContext.save();
        offscreenContext.beginPath();
        offscreenContext.roundRect(cardPaddingPixels, cardPaddingPixels, contentInnerWidth, imageDisplayHeight, 12);
        offscreenContext.clip();
        offscreenContext.drawImage(loadedImageElement, cardPaddingPixels, cardPaddingPixels, contentInnerWidth, imageDisplayHeight);
        offscreenContext.restore();
      } else {
        offscreenContext.fillStyle = '#F3F4F6';
        offscreenContext.beginPath();
        offscreenContext.roundRect(cardPaddingPixels, cardPaddingPixels, contentInnerWidth, imageDisplayHeight, 12);
        offscreenContext.fill();
      }

      if (currentAnimationItem.promotionalBadgeText) {
        offscreenContext.save();
        offscreenContext.beginPath();
        offscreenContext.roundRect(cardPaddingPixels + 6, cardPaddingPixels + 6, 76, 18, 5);
        offscreenContext.fillStyle = currentAnimationItem.promotionalBadgeStyle === 'bright' ? '#F59E0B' : '#114B2B';
        offscreenContext.fill();
        offscreenContext.fillStyle = '#FFFFFF';
        offscreenContext.font = 'bold 8.5px system-ui, -apple-system, sans-serif';
        offscreenContext.fillText(currentAnimationItem.promotionalBadgeText.toUpperCase(), cardPaddingPixels + 12, cardPaddingPixels + 18);
        offscreenContext.restore();
      }

      const categoryTopPosition = cardPaddingPixels + imageDisplayHeight + 15;
      offscreenContext.fillStyle = '#114B2B';
      offscreenContext.font = 'bold 10px system-ui, -apple-system, sans-serif';
      offscreenContext.fillText((currentAnimationItem.productCategoryName || 'QUESERÍA & LÁCTEOS').toUpperCase(), cardPaddingPixels, categoryTopPosition);

      const titleStartTopPosition = categoryTopPosition + 15;
      offscreenContext.fillStyle = '#111827';
      offscreenContext.font = 'bold 12.5px system-ui, -apple-system, sans-serif';
      const descriptionStartTopPosition = renderWrappedTextLines(
        offscreenContext,
        currentAnimationItem.productTitle || '',
        cardPaddingPixels,
        titleStartTopPosition,
        contentInnerWidth,
        15,
        2
      );

      offscreenContext.fillStyle = '#6B7280';
      offscreenContext.font = '10px system-ui, -apple-system, sans-serif';
      renderWrappedTextLines(
        offscreenContext,
        currentAnimationItem.productDescription || '',
        cardPaddingPixels,
        descriptionStartTopPosition + 2,
        contentInnerWidth,
        13,
        2
      );

      const dividerVerticalTop = offscreenCanvasHeight - 88;
      offscreenContext.strokeStyle = '#F3F4F6';
      offscreenContext.lineWidth = 1;
      offscreenContext.beginPath();
      offscreenContext.moveTo(cardPaddingPixels, dividerVerticalTop);
      offscreenContext.lineTo(offscreenCanvasWidth - cardPaddingPixels, dividerVerticalTop);
      offscreenContext.stroke();

      const priceUsdTopPosition = dividerVerticalTop + 17;
      offscreenContext.fillStyle = '#111827';
      offscreenContext.font = '900 15px system-ui, -apple-system, sans-serif';
      const priceUnitString = currentAnimationItem.productPriceUnit ? ` / ${currentAnimationItem.productPriceUnit}` : '';
      offscreenContext.fillText(`$${(currentAnimationItem.productPriceUsd || 0).toFixed(2)}${priceUnitString}`, cardPaddingPixels, priceUsdTopPosition);

      const priceBcvTopPosition = priceUsdTopPosition + 14;
      offscreenContext.fillStyle = '#065F46';
      offscreenContext.font = 'bold 11px system-ui, -apple-system, sans-serif';
      offscreenContext.fillText(`Ref. BCV: Bs. ${currentAnimationItem.priceBcvEquivalent || '0,00'}`, cardPaddingPixels, priceBcvTopPosition);

      const buttonVerticalTop = offscreenCanvasHeight - 34;
      offscreenContext.fillStyle = '#114B2B';
      offscreenContext.beginPath();
      offscreenContext.roundRect(cardPaddingPixels, buttonVerticalTop, contentInnerWidth, 26, 8);
      offscreenContext.fill();

      offscreenContext.fillStyle = '#FFFFFF';
      offscreenContext.font = 'bold 11px system-ui, -apple-system, sans-serif';
      offscreenContext.fillText('+ Agregar', cardPaddingPixels + contentInnerWidth / 2 - 24, buttonVerticalTop + 17);

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
      const animationProgress = clampNumericValue(elapsedMilliseconds / animationTotalDurationMs, 0, 1);

      mainCanvasContext.clearRect(0, 0, screenDimensionWidth, screenDimensionHeight);

      const totalScanlineCount = 90;
      const scanlineStepHeight = windowDimensionHeight / totalScanlineCount;

      for (let scanlineIndex = 0; scanlineIndex < totalScanlineCount; scanlineIndex++) {
        const scanlineRowRatio = scanlineIndex / totalScanlineCount;

        const horizontalProgressStart = (1 - scanlineRowRatio) * 0.65;
        const horizontalInterpolationProgress = clampNumericValue(
          (animationProgress - horizontalProgressStart) / (1 - horizontalProgressStart),
          0,
          1
        );
        const easedHorizontalFactor = easeInOutCubicProgress(horizontalInterpolationProgress);

        const verticalProgressStart = (1 - scanlineRowRatio) * 0.22;
        const verticalInterpolationProgress = clampNumericValue(
          (animationProgress - verticalProgressStart) / (1 - verticalProgressStart),
          0,
          1
        );
        const easedVerticalFactor = easeInQuadProgress(verticalInterpolationProgress);

        const scanlineLeftPosition = linearInterpolateValue(windowStartLeftCoordinate, dockTargetCoordinateX, easedHorizontalFactor);
        const scanlineRightPosition = linearInterpolateValue(windowStartLeftCoordinate + windowDimensionWidth, dockTargetCoordinateX, easedHorizontalFactor);
        const scanlineDestinationVertical = linearInterpolateValue(windowStartTopCoordinate + scanlineRowRatio * windowDimensionHeight, dockTargetCoordinateY, easedVerticalFactor);
        const scanlineDestinationWidth = scanlineRightPosition - scanlineLeftPosition;

        if (scanlineDestinationWidth < 0.8) {
          continue;
        }

        const sourceSliceVerticalPosition = scanlineRowRatio * offscreenCanvasHeight;
        const sourceSliceHeightPixels = (1 / totalScanlineCount) * offscreenCanvasHeight;

        mainCanvasContext.drawImage(
          offscreenCanvasElement,
          0,
          sourceSliceVerticalPosition,
          offscreenCanvasWidth,
          sourceSliceHeightPixels,
          scanlineLeftPosition,
          scanlineDestinationVertical,
          scanlineDestinationWidth,
          scanlineStepHeight + 0.6
        );
      }

      if (animationProgress > 0.7) {
        const glowOpacityRatio = easeOutQuadProgress((animationProgress - 0.7) / 0.3) * 0.45;
        const radialGradientGlow = mainCanvasContext.createRadialGradient(
          dockTargetCoordinateX,
          dockTargetCoordinateY,
          2,
          dockTargetCoordinateX,
          dockTargetCoordinateY,
          65
        );
        radialGradientGlow.addColorStop(0, `rgba(16, 185, 129, ${glowOpacityRatio})`);
        radialGradientGlow.addColorStop(0.5, `rgba(245, 158, 11, ${glowOpacityRatio * 0.5})`);
        radialGradientGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');

        mainCanvasContext.fillStyle = radialGradientGlow;
        mainCanvasContext.beginPath();
        mainCanvasContext.arc(dockTargetCoordinateX, dockTargetCoordinateY, 65, 0, Math.PI * 2);
        mainCanvasContext.fill();
      }

      if (animationProgress < 1) {
        animationFrameHandle = requestAnimationFrame(renderScanlineGenieFrame);
      } else {
        mainCanvasContext.clearRect(0, 0, screenDimensionWidth, screenDimensionHeight);
      }
    };

    let hasStartedAnimationLoop = false;
    const startAnimationOnce = () => {
      if (!hasStartedAnimationLoop) {
        hasStartedAnimationLoop = true;
        animationFrameHandle = requestAnimationFrame(renderScanlineGenieFrame);
      }
    };

    const productImageElement = new Image();
    productImageElement.crossOrigin = 'anonymous';
    productImageElement.onload = () => {
      drawCompleteCardReplica(productImageElement);
      startAnimationOnce();
    };
    productImageElement.onerror = () => {
      drawCompleteCardReplica(null);
      startAnimationOnce();
    };
    productImageElement.src = currentAnimationItem.productImage;

    drawCompleteCardReplica(productImageElement.complete && productImageElement.naturalWidth > 0 ? productImageElement : null);
    startAnimationOnce();

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

