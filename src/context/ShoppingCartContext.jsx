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

  const [activeToastNotification, setActiveToastNotification] = useState({
    isVisible: false,
    productTitle: '',
    productImage: '',
    selectedCutOption: '',
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

  const addProductToCart = (productItem, selectedCutOption = '', quantityToAdd = 1) => {
    setCartItemList((previousItemList) => {
      const existingItemIndex = previousItemList.findIndex((elementItem) => {
        return elementItem.productIdentifier === productItem.productIdentifier &&
          elementItem.selectedCutOption === selectedCutOption;
      });

      if (existingItemIndex > -1) {
        const updatedList = [...previousItemList];
        const currentTargetItem = updatedList[existingItemIndex];
        updatedList[existingItemIndex] = {
          ...currentTargetItem,
          selectedQuantity: currentTargetItem.selectedQuantity + quantityToAdd
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
        selectedCutOption: selectedCutOption,
        selectedQuantity: quantityToAdd
      };

      return [...previousItemList, newCartEntry];
    });

    setActiveToastNotification({
      isVisible: true,
      productTitle: productItem.productTitle,
      productImage: productItem.productImage,
      selectedCutOption: selectedCutOption,
      productPriceUsd: productItem.productPriceUsd
    });
  };

  const updateItemQuantity = (productIdentifier, selectedCutOption, newQuantity) => {
    if (newQuantity <= 0) {
      removeProductFromCart(productIdentifier, selectedCutOption);
      return;
    }

    setCartItemList((previousItemList) => {
      return previousItemList.map((elementItem) => {
        if (elementItem.productIdentifier === productIdentifier &&
            elementItem.selectedCutOption === selectedCutOption) {
          return {
            ...elementItem,
            selectedQuantity: newQuantity
          };
        }
        return elementItem;
      });
    });
  };

  const removeProductFromCart = (productIdentifier, selectedCutOption) => {
    setCartItemList((previousItemList) => {
      return previousItemList.filter((elementItem) => {
        return !(elementItem.productIdentifier === productIdentifier &&
          elementItem.selectedCutOption === selectedCutOption);
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
    openCartDrawer,
    closeCartDrawer,
    hideToastNotification,
    addProductToCart,
    updateItemQuantity,
    removeProductFromCart,
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
