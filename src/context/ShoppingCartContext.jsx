import React, { createContext, useState, useEffect } from 'react';
import { fetchLiveBcvExchangeRate } from '../services/bcvExchangeRateService';

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
    productTitle: '',
    productImage: '',
    productPriceUsd: 0
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
    itemCustomNote = ''
  ) => {
    const quantityToAdd = typeof quantityOrParameter === 'number'
      ? quantityOrParameter
      : (typeof fallbackQuantity === 'number' ? fallbackQuantity : 1);

    const sanitizedNote = typeof itemCustomNote === 'string' ? itemCustomNote.trim() : '';

    setCartItemList((previousItemList) => {
      const existingItemIndex = previousItemList.findIndex((elementItem) => {
        return elementItem.productIdentifier === productItem.productIdentifier;
      });

      if (existingItemIndex > -1) {
        const updatedList = [...previousItemList];
        const currentTargetItem = updatedList[existingItemIndex];
        updatedList[existingItemIndex] = {
          ...currentTargetItem,
          selectedQuantity: currentTargetItem.selectedQuantity + quantityToAdd,
          customItemNote: sanitizedNote || currentTargetItem.customItemNote
        };
        return updatedList;
      }

      const newCartEntry = {
        productIdentifier: productItem.productIdentifier,
        productTitle: productItem.productTitle,
        productCategoryName: productItem.productCategoryName,
        productPriceUsd: productItem.productPriceUsd,
        productPriceUnit: productItem.productPriceUnit,
        productImage: productItem.productImage,
        selectedQuantity: quantityToAdd,
        customItemNote: sanitizedNote
      };

      return [...previousItemList, newCartEntry];
    });

    if (originCoordinates && typeof originCoordinates.coordinateX === 'number') {
      const animationUniqueKey = `${Date.now()}_${Math.random()}`;
      const newFlyingItem = {
        uniqueKey: animationUniqueKey,
        productTitle: productItem.productTitle,
        productImage: productItem.productImage,
        productPriceUsd: productItem.productPriceUsd,
        productPriceUnit: productItem.productPriceUnit,
        productCategoryName: productItem.productCategoryName,
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
      }, 480);

      setTimeout(() => {
        setFlyingCartAnimationList((previousList) => {
          return previousList.filter((flyingItem) => flyingItem.uniqueKey !== animationUniqueKey);
        });
      }, 560);
    } else {
      setIsCartBumpingActive(true);
      setTimeout(() => {
        setIsCartBumpingActive(false);
      }, 500);
    }

    setActiveToastNotification({
      isVisible: true,
      productIdentifier: productItem.productIdentifier,
      productTitle: productItem.productTitle,
      productImage: productItem.productImage,
      productPriceUsd: productItem.productPriceUsd,
      quantityAdded: quantityToAdd,
      toastTimestampKey: Date.now()
    });
  };

  const undoLastCartAddition = () => {
    if (!activeToastNotification.productIdentifier) {
      return;
    }

    const targetIdentifier = activeToastNotification.productIdentifier;
    const quantityToDeduct = activeToastNotification.quantityAdded || 1;

    setCartItemList((previousItemList) => {
      const existingItem = previousItemList.find(
        (elementItem) => elementItem.productIdentifier === targetIdentifier
      );

      if (!existingItem) {
        return previousItemList;
      }

      if (existingItem.selectedQuantity <= quantityToDeduct) {
        return previousItemList.filter(
          (elementItem) => elementItem.productIdentifier !== targetIdentifier
        );
      }

      return previousItemList.map((elementItem) => {
        if (elementItem.productIdentifier === targetIdentifier) {
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

  const updateItemQuantity = (productIdentifier, newQuantity) => {
    if (newQuantity <= 0) {
      removeProductFromCart(productIdentifier);
      return;
    }

    setCartItemList((previousItemList) => {
      return previousItemList.map((elementItem) => {
        if (elementItem.productIdentifier === productIdentifier) {
          return {
            ...elementItem,
            selectedQuantity: newQuantity
          };
        }
        return elementItem;
      });
    });
  };

  const removeProductFromCart = (productIdentifier) => {
    setCartItemList((previousItemList) => {
      return previousItemList.filter((elementItem) => {
        return elementItem.productIdentifier !== productIdentifier;
      });
    });
  };

  const updateCartItemNote = (productIdentifier, noteText) => {
    setCartItemList((previousItemList) => {
      return previousItemList.map((elementItem) => {
        if (elementItem.productIdentifier === productIdentifier) {
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

  const totalCartAmountUsd = cartItemList.reduce((accumulatorAmount, currentEntry) => {
    return accumulatorAmount + (currentEntry.productPriceUsd * currentEntry.selectedQuantity);
  }, 0);

  const totalCartAmountBcv = totalCartAmountUsd * exchangeRateBcv;

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
