import React, { createContext, useState, useEffect, useMemo } from 'react';
import { fetchLiveBcvExchangeRate } from '../services/bcvExchangeRateService';
import promotionsShowcaseData from '../data/promotionsShowcaseData.json';

export const ShoppingCartContext = createContext(null);

export const ShoppingCartProvider = ({ children }) => {
  const [cartItemList, setCartItemList] = useState(() => {
    try {
      const storedCartContent = localStorage.getItem('san_joaquin_cart_items');
      return storedCartContent ? JSON.parse(storedCartContent) : [];
    } catch (storageError) {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const [flyingCartAnimationList, setFlyingCartAnimationList] = useState([]);
  const [isCartBumpingActive, setIsCartBumpingActive] = useState(false);

  const [activeToastNotification, setActiveToastNotification] = useState({
    isVisible: false,
    productIdentifier: '',
    productTitle: '',
    productImage: '',
    productPriceUsd: 0,
    quantityAdded: 1,
    portionLabel: ''
  });

  const [exchangeRateBcv, setExchangeRateBcv] = useState(() => {
    return parseFloat(import.meta.env.VITE_BCV_EXCHANGE_RATE || '62.50');
  });

  const [exchangeRateDateString, setExchangeRateDateString] = useState('');
  const [isLiveRateActive, setIsLiveRateActive] = useState(false);

  useEffect(() => {
    const synchronizeLiveExchangeRate = async () => {
      const liveRateResult = await fetchLiveBcvExchangeRate();
      if (liveRateResult && liveRateResult.exchangeRateUsd > 0) {
        setExchangeRateBcv(liveRateResult.exchangeRateUsd);
        setExchangeRateDateString(liveRateResult.rateDateString);
        setIsLiveRateActive(true);
      }
    };

    synchronizeLiveExchangeRate();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('san_joaquin_cart_items', JSON.stringify(cartItemList));
    } catch (storageSaveError) {
      return;
    }
  }, [cartItemList]);

  const openCartDrawer = () => {
    setIsCartDrawerOpen(true);
  };

  const closeCartDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const hideToastNotification = () => {
    setActiveToastNotification((previousToastState) => ({
      ...previousToastState,
      isVisible: false
    }));
  };

  const addProductToCart = (
    productItem,
    quantityOrParameter = 1,
    fallbackQuantity = 1,
    originCoordinates = null,
    itemCustomNote = '',
    customOptions = {}
  ) => {
    const quantityToAdd = typeof quantityOrParameter === 'number'
      ? quantityOrParameter
      : (typeof fallbackQuantity === 'number' ? fallbackQuantity : 1);

    const sanitizedNote = typeof itemCustomNote === 'string' ? itemCustomNote.trim() : '';
    const weightFraction = customOptions?.weightFraction || null;

    const fractionKey = weightFraction ? weightFraction.fractionKey : 'std';
    const itemCartKey = `${productItem.productIdentifier}__${fractionKey}`;

    const effectiveFactor = weightFraction?.factor || 1;
    const effectivePriceUsd = productItem.productPriceUsd * effectiveFactor;
    const portionLabel = weightFraction ? weightFraction.label : (productItem.productPriceUnit === 'kg' ? '1 Kg' : '');

    const productStockLimit = productItem.availableStockQuantity ?? Infinity;

    let actualQuantityAdded = quantityToAdd;
    let stockLimitReached = false;

    setCartItemList((previousItemList) => {
      const existingItemIndex = previousItemList.findIndex((elementItem) => {
        const currentKey = elementItem.cartItemKey || elementItem.productIdentifier;
        return currentKey === itemCartKey;
      });

      if (existingItemIndex > -1) {
        const updatedList = [...previousItemList];
        const currentTargetItem = updatedList[existingItemIndex];
        const currentQuantityInCart = currentTargetItem.selectedQuantity;
        const remainingStock = productStockLimit - currentQuantityInCart;

        if (remainingStock <= 0) {
          stockLimitReached = true;
          actualQuantityAdded = 0;
          return previousItemList;
        }

        actualQuantityAdded = Math.min(quantityToAdd, remainingStock);
        if (actualQuantityAdded < quantityToAdd) {
          stockLimitReached = true;
        }

        updatedList[existingItemIndex] = {
          ...currentTargetItem,
          selectedQuantity: currentQuantityInCart + actualQuantityAdded,
          availableStockQuantity: productStockLimit,
          customItemNote: sanitizedNote || currentTargetItem.customItemNote
        };
        return updatedList;
      }

      actualQuantityAdded = Math.min(quantityToAdd, productStockLimit);
      if (actualQuantityAdded < quantityToAdd) {
        stockLimitReached = true;
      }

      if (actualQuantityAdded <= 0) {
        stockLimitReached = true;
        return previousItemList;
      }

      const newCartEntry = {
        cartItemKey: itemCartKey,
        productIdentifier: productItem.productIdentifier,
        productTitle: productItem.productTitle,
        productCategoryName: productItem.productCategoryName,
        productPriceUsd: effectivePriceUsd,
        basePriceUsd: productItem.productPriceUsd,
        portionLabel: portionLabel,
        productPriceUnit: productItem.productPriceUnit,
        productImage: productItem.productImage,
        selectedQuantity: actualQuantityAdded,
        availableStockQuantity: productStockLimit,
        customItemNote: sanitizedNote
      };

      return [...previousItemList, newCartEntry];
    });

    if (stockLimitReached && actualQuantityAdded === 0) {
      return { success: false, stockLimitReached: true };
    }

    if (originCoordinates && typeof originCoordinates.coordinateX === 'number') {
      const animationUniqueKey = `${Date.now()}_${Math.random()}`;
      const calculatedBcvEquivalent = (effectivePriceUsd * exchangeRateBcv).toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      const newFlyingItem = {
        uniqueKey: animationUniqueKey,
        productTitle: productItem.productTitle,
        productImage: productItem.productImage,
        productPriceUsd: effectivePriceUsd,
        productPriceUnit: productItem.productPriceUnit,
        productCategoryName: productItem.productCategoryName,
        productDescription: productItem.productDescription,
        promotionalBadgeText: productItem.promotionalBadgeText,
        promotionalBadgeStyle: productItem.promotionalBadgeStyle,
        priceBcvEquivalent: calculatedBcvEquivalent,
        startingX: originCoordinates.coordinateX,
        startingY: originCoordinates.coordinateY,
        cardStartX: originCoordinates.cardStartX || originCoordinates.coordinateX - 80,
        cardStartY: originCoordinates.cardStartY || originCoordinates.coordinateY - 120,
        cardWidth: originCoordinates.cardWidth || 160,
        cardHeight: originCoordinates.cardHeight || 220
      };
      setFlyingCartAnimationList((previousList) => [...previousList, newFlyingItem]);

      setTimeout(() => {
        setIsCartBumpingActive(true);
        setTimeout(() => {
          setIsCartBumpingActive(false);
        }, 400);
      }, 530);

      setTimeout(() => {
        setFlyingCartAnimationList((previousList) => {
          return previousList.filter((flyingItem) => flyingItem.uniqueKey !== animationUniqueKey);
        });
      }, 620);
    } else {
      setIsCartBumpingActive(true);
      setTimeout(() => {
        setIsCartBumpingActive(false);
      }, 500);
    }

    setActiveToastNotification({
      isVisible: true,
      cartItemKey: itemCartKey,
      productIdentifier: productItem.productIdentifier,
      productTitle: productItem.productTitle,
      portionLabel: portionLabel,
      productImage: productItem.productImage,
      productPriceUsd: effectivePriceUsd,
      quantityAdded: quantityToAdd,
      toastTimestampKey: Date.now()
    });

    window.dispatchEvent(new CustomEvent('sj:product-added-to-cart'));
  };

  const undoLastCartAddition = () => {
    if (!activeToastNotification.cartItemKey && !activeToastNotification.productIdentifier) {
      return;
    }

    const targetKey = activeToastNotification.cartItemKey || activeToastNotification.productIdentifier;
    const quantityToDeduct = activeToastNotification.quantityAdded || 1;

    setCartItemList((previousItemList) => {
      const existingItem = previousItemList.find(
        (elementItem) => (elementItem.cartItemKey || elementItem.productIdentifier) === targetKey
      );

      if (!existingItem) {
        return previousItemList;
      }

      if (existingItem.selectedQuantity <= quantityToDeduct) {
        return previousItemList.filter(
          (elementItem) => (elementItem.cartItemKey || elementItem.productIdentifier) !== targetKey
        );
      }

      return previousItemList.map((elementItem) => {
        if ((elementItem.cartItemKey || elementItem.productIdentifier) === targetKey) {
          return {
            ...elementItem,
            selectedQuantity: elementItem.selectedQuantity - quantityToDeduct
          };
        }
        return elementItem;
      });
    });

    hideToastNotification();
  };

  const updateItemQuantity = (itemIdentifierOrKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeProductFromCart(itemIdentifierOrKey);
      return;
    }

    setCartItemList((previousItemList) => {
      return previousItemList.map((elementItem) => {
        const currentKey = elementItem.cartItemKey || elementItem.productIdentifier;
        if (currentKey === itemIdentifierOrKey) {
          const stockLimit = elementItem.availableStockQuantity ?? Infinity;
          const clampedQuantity = Math.min(newQuantity, stockLimit);
          return {
            ...elementItem,
            selectedQuantity: clampedQuantity
          };
        }
        return elementItem;
      });
    });
  };

  const removeProductFromCart = (itemIdentifierOrKey) => {
    setCartItemList((previousItemList) => {
      return previousItemList.filter((elementItem) => {
        const currentKey = elementItem.cartItemKey || elementItem.productIdentifier;
        return currentKey !== itemIdentifierOrKey;
      });
    });
  };

  const updateCartItemNote = (itemIdentifierOrKey, noteText) => {
    setCartItemList((previousItemList) => {
      return previousItemList.map((elementItem) => {
        const currentKey = elementItem.cartItemKey || elementItem.productIdentifier;
        if (currentKey === itemIdentifierOrKey) {
          return {
            ...elementItem,
            customItemNote: noteText
          };
        }
        return elementItem;
      });
    });
  };

  const clearCartItems = () => {
    setCartItemList([]);
  };

  const totalItemsCount = cartItemList.reduce((accumulatorCount, currentEntry) => {
    return accumulatorCount + currentEntry.selectedQuantity;
  }, 0);

  const rawSubtotalUsd = cartItemList.reduce((accumulatorAmount, currentEntry) => {
    return accumulatorAmount + (currentEntry.productPriceUsd * currentEntry.selectedQuantity);
  }, 0);

  const appliedCombosList = useMemo(() => {
    const activeCombos = [];

    promotionsShowcaseData.forEach((promoDefinition) => {
      const requiredProductIds = promoDefinition.matchingProductIds;
      if (!requiredProductIds || requiredProductIds.length === 0 || !promoDefinition.comboPriceUsd) return;

      const productQuantitiesInCart = requiredProductIds.map((requiredId) => {
        const matchingCartItems = cartItemList.filter(
          (cartEntry) => cartEntry.productIdentifier === requiredId
        );
        return matchingCartItems.reduce((totalQuantity, cartEntry) => totalQuantity + cartEntry.selectedQuantity, 0);
      });

      const completedCombosCount = Math.min(...productQuantitiesInCart);

      if (completedCombosCount > 0) {
        let singleBundleRegularSum = 0;
        requiredProductIds.forEach((requiredId) => {
          const matchingCartItem = cartItemList.find(
            (cartEntry) => cartEntry.productIdentifier === requiredId
          );
          if (matchingCartItem) {
            singleBundleRegularSum += matchingCartItem.productPriceUsd;
          }
        });

        const comboSpecialPrice = promoDefinition.comboPriceUsd;
        const singleComboSavings = Math.max(0, singleBundleRegularSum - comboSpecialPrice);
        const totalComboSavings = singleComboSavings * completedCombosCount;

        if (totalComboSavings > 0) {
          activeCombos.push({
            promoIdentifier: promoDefinition.promoIdentifier,
            promoTitle: promoDefinition.promoTitle,
            completedCombos: completedCombosCount,
            regularBundlePrice: singleBundleRegularSum * completedCombosCount,
            singleBundlePrice: singleBundleRegularSum,
            discountAmount: totalComboSavings,
            finalComboPrice: comboSpecialPrice * completedCombosCount,
            singleComboPrice: comboSpecialPrice
          });
        }
      }
    });

    return activeCombos;
  }, [cartItemList]);

  const totalComboDiscountUsd = appliedCombosList.reduce((accumulatorSavings, comboEntry) => {
    return accumulatorSavings + comboEntry.discountAmount;
  }, 0);

  const totalCartAmountUsd = Math.max(0, rawSubtotalUsd - totalComboDiscountUsd);
  const totalCartAmountBcv = totalCartAmountUsd * exchangeRateBcv;
  const rawSubtotalBcv = rawSubtotalUsd * exchangeRateBcv;
  const totalComboDiscountBcv = totalComboDiscountUsd * exchangeRateBcv;

  const contextValue = {
    cartItemList,
    isCartDrawerOpen,
    activeToastNotification,
    flyingCartAnimationList,
    isCartBumpingActive,
    openCartDrawer,
    closeCartDrawer,
    hideToastNotification,
    addProductToCart,
    undoLastCartAddition,
    updateItemQuantity,
    removeProductFromCart,
    updateCartItemNote,
    clearCartItems,
    totalItemsCount,
    rawSubtotalUsd,
    rawSubtotalBcv,
    appliedCombosList,
    totalComboDiscountUsd,
    totalComboDiscountBcv,
    totalCartAmountUsd,
    totalCartAmountBcv,
    exchangeRateBcv,
    exchangeRateDateString,
    isLiveRateActive
  };

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
    </ShoppingCartContext.Provider>
  );
};
