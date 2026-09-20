import React, { useState, useEffect } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import productsCatalogData from '../../data/productsCatalogData.json';

export const ProductDetailPage = ({
  productItem,
  onBackToStore,
  onSelectProduct
}) => {
  const { addProductToCart, exchangeRateBcv } = useShoppingCart();



  const [productQuantity, setProductQuantity] = useState(1);
  const [addedFeedbackActive, setAddedFeedbackActive] = useState(false);
  const [isImageZoomModalOpen, setIsImageZoomModalOpen] = useState(false);
  const [zoomMagnificationFactor, setZoomMagnificationFactor] = useState(1);
  const [panTranslatePosition, setPanTranslatePosition] = useState({ horizontalCoordinate: 0, verticalCoordinate: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragOriginCoordinate, setDragOriginCoordinate] = useState({ horizontalStart: 0, verticalStart: 0 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setProductQuantity(1);
    setIsImageZoomModalOpen(false);
    setZoomMagnificationFactor(1);
    setPanTranslatePosition({ horizontalCoordinate: 0, verticalCoordinate: 0 });
  }, [productItem]);

  useEffect(() => {
    const handleKeyDownListener = (keyboardEvent) => {
      if (keyboardEvent.key === 'Escape') {
        setIsImageZoomModalOpen(false);
        setZoomMagnificationFactor(1);
      }
    };

    window.addEventListener('keydown', handleKeyDownListener);
    return () => {
      window.removeEventListener('keydown', handleKeyDownListener);
    };
  }, []);

  if (!productItem) {
    return null;
  }

  const configuredPhoneNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || '584147675878';
  const cleanDestinationNumber = configuredPhoneNumber.replace(/[^\d]/g, '');

  const priceBcvEquivalent = (productItem.productPriceUsd * exchangeRateBcv).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const totalCalculatedUsd = (productItem.productPriceUsd * productQuantity).toFixed(2);
  const totalCalculatedBcv = (productItem.productPriceUsd * productQuantity * exchangeRateBcv).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleIncrementQuantity = () => {
    setProductQuantity((previousQuantity) => previousQuantity + 1);
  };

  const handleDecrementQuantity = () => {
    setProductQuantity((previousQuantity) => (previousQuantity > 1 ? previousQuantity - 1 : 1));
  };

  const handleAddToCart = (clickEvent) => {
    const buttonBoundingRect = clickEvent?.currentTarget?.getBoundingClientRect();
    const originCoordinates = buttonBoundingRect ? {
      coordinateX: buttonBoundingRect.left + buttonBoundingRect.width / 2,
      coordinateY: buttonBoundingRect.top + buttonBoundingRect.height / 2
    } : null;
    addProductToCart(productItem, productQuantity, productQuantity, originCoordinates);
    setAddedFeedbackActive(true);
    setTimeout(() => {
      setAddedFeedbackActive(false);
    }, 1500);
  };

  const handleOpenZoomModal = () => {
    setIsImageZoomModalOpen(true);
    setZoomMagnificationFactor(1.5);
    setPanTranslatePosition({ horizontalCoordinate: 0, verticalCoordinate: 0 });
  };

  const handleCloseZoomModal = () => {
    setIsImageZoomModalOpen(false);
    setZoomMagnificationFactor(1);
    setPanTranslatePosition({ horizontalCoordinate: 0, verticalCoordinate: 0 });
  };

  const handleZoomInAction = () => {
    setZoomMagnificationFactor((previousZoom) => Math.min(previousZoom + 0.5, 3.5));
  };

  const handleZoomOutAction = () => {
    setZoomMagnificationFactor((previousZoom) => {
      const updatedZoom = Math.max(previousZoom - 0.5, 1);
      if (updatedZoom === 1) {
        setPanTranslatePosition({ horizontalCoordinate: 0, verticalCoordinate: 0 });
      }
      return updatedZoom;
    });
  };

  const handleResetZoomAction = () => {
    setZoomMagnificationFactor(1);
    setPanTranslatePosition({ horizontalCoordinate: 0, verticalCoordinate: 0 });
  };

  const handleToggleZoomOnClick = () => {
    if (zoomMagnificationFactor > 1.2) {
      setZoomMagnificationFactor(1);
      setPanTranslatePosition({ horizontalCoordinate: 0, verticalCoordinate: 0 });
    } else {
      setZoomMagnificationFactor(2.2);
    }
  };

  const handleMouseDownOnImage = (mouseEvent) => {
    if (zoomMagnificationFactor <= 1) {
      return;
    }
    setIsDraggingImage(true);
    setDragOriginCoordinate({
      horizontalStart: mouseEvent.clientX - panTranslatePosition.horizontalCoordinate,
      verticalStart: mouseEvent.clientY - panTranslatePosition.verticalCoordinate
    });
  };

  const handleMouseMoveOnImage = (mouseEvent) => {
    if (!isDraggingImage || zoomMagnificationFactor <= 1) {
      return;
    }
    const updatedHorizontalCoordinate = mouseEvent.clientX - dragOriginCoordinate.horizontalStart;
    const updatedVerticalCoordinate = mouseEvent.clientY - dragOriginCoordinate.verticalStart;
    setPanTranslatePosition({
      horizontalCoordinate: updatedHorizontalCoordinate,
      verticalCoordinate: updatedVerticalCoordinate
    });
  };

  const handleMouseUpOnImage = () => {
    setIsDraggingImage(false);
  };

  const directProductWhatsAppUrl = `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent(
    `Hola Quesería San Joaquín! Quisiera ordenar: ${productQuantity}x ${productItem.productTitle}. Total: $${totalCalculatedUsd} (Bs. ${totalCalculatedBcv}).`
  )}`;

  const relatedProductsList = productsCatalogData
    .filter((candidateProduct) => candidateProduct.departmentIdentifier === productItem.departmentIdentifier && candidateProduct.productIdentifier !== productItem.productIdentifier)
    .slice(0, 4);

  return (
    <div className="w-full bg-[#fafafa] pt-2 pb-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-2 sm:space-y-8">
        <nav className="flex items-center gap-2 text-xs text-neutral-muted">
          <button
            type="button"
            onClick={onBackToStore}
            className="w-9 h-9 sm:w-auto sm:h-auto rounded-full sm:rounded-none bg-white sm:bg-transparent border border-neutral-200 sm:border-0 hover:text-primary transition-all cursor-pointer flex items-center justify-center sm:justify-start gap-1 font-bold shadow-2xs sm:shadow-none"
            aria-label="Volver a la tienda"
          >
            <span className="material-symbols-outlined text-lg sm:text-base">arrow_back</span>
            <span className="hidden sm:inline">Volver a la Tienda</span>
          </button>
          <span className="hidden sm:inline">/</span>
          <span className="capitalize hidden sm:inline">{productItem.productCategoryName}</span>
          <span className="hidden sm:inline">/</span>
          <span className="text-neutral-dark font-bold truncate hidden sm:inline">{productItem.productTitle}</span>
        </nav>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-border p-5 sm:p-8 lg:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-6 space-y-4">
            <div
              onClick={handleOpenZoomModal}
              className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square rounded-2xl bg-surface-alt overflow-hidden border border-neutral-border shadow-xs cursor-zoom-in group"
            >
              <img
                src={productItem.productImage}
                alt={productItem.productTitle}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center pointer-events-none">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 backdrop-blur-xs text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xl">
                  <span className="material-symbols-outlined text-lg">zoom_in</span>
                  <span>Clic para hacer Zoom</span>
                </div>
              </div>

              {productItem.promotionalBadgeText && (
                <div className="absolute top-4 left-4 z-10 bg-accent-bright text-neutral-dark text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md shadow-md">
                  {productItem.promotionalBadgeText}
                </div>
              )}

              <button
                type="button"
                onClick={(mouseEvent) => {
                  mouseEvent.stopPropagation();
                  handleOpenZoomModal();
                }}
                className="absolute bottom-4 right-4 z-10 bg-white/90 hover:bg-white text-neutral-dark p-2.5 rounded-xl shadow-lg border border-neutral-200 cursor-pointer flex items-center justify-center transition-all active:scale-95"
                aria-label="Ampliar imagen"
              >
                <span className="material-symbols-outlined text-xl">fit_screen</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="p-2.5 rounded-xl bg-surface-alt border border-neutral-border text-center">
                <span className="material-symbols-outlined text-primary text-xl block mb-0.5">scale</span>
                <span className="text-[11px] font-bold text-neutral-dark block leading-tight">Pesaje Exacto</span>
                <span className="text-[9px] text-neutral-muted">Gramo por gramo</span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-alt border border-neutral-border text-center">
                <span className="material-symbols-outlined text-primary text-xl block mb-0.5">ac_unit</span>
                <span className="text-[11px] font-bold text-neutral-dark block leading-tight">Cadena Fría</span>
                <span className="text-[9px] text-neutral-muted">Frescura 100%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-alt border border-neutral-border text-center">
                <span className="material-symbols-outlined text-primary text-xl block mb-0.5">moped</span>
                <span className="text-[11px] font-bold text-neutral-dark block leading-tight">Express</span>
                <span className="text-[9px] text-neutral-muted">En Maracaibo</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col space-y-6">
            <div>
              <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-1">
                {productItem.productCategoryName}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-dark tracking-tight leading-tight">
                {productItem.productTitle}
              </h1>
              <p className="text-xs sm:text-sm text-neutral-muted mt-2 leading-relaxed">
                {productItem.productDescription}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface-alt border border-neutral-border flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-neutral-muted uppercase font-bold block">Precio por {productItem.productPriceUnit}</span>
                <div className="text-2xl sm:text-3xl font-black text-neutral-dark leading-tight">
                  ${productItem.productPriceUsd.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-neutral-muted">USD</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-neutral-muted uppercase block">Tasa Oficial BCV</span>
                <div className="text-sm sm:text-base font-extrabold text-emerald-800">
                  Bs. {priceBcvEquivalent}
                </div>
              </div>
            </div>



            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-neutral-dark uppercase tracking-wider">
                Cantidad a pedir:
              </label>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center border border-neutral-border rounded-xl bg-white shadow-xs">
                  <button
                    type="button"
                    onClick={handleDecrementQuantity}
                    className="w-10 h-10 flex items-center justify-center text-neutral-dark hover:bg-surface-alt rounded-l-xl transition-colors cursor-pointer"
                    aria-label="Disminuir cantidad"
                  >
                    <span className="material-symbols-outlined text-lg">remove</span>
                  </button>
                  <span className="w-12 text-center text-sm font-black text-neutral-dark">
                    {productQuantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrementQuantity}
                    className="w-10 h-10 flex items-center justify-center text-neutral-dark hover:bg-surface-alt rounded-r-xl transition-colors cursor-pointer"
                    aria-label="Aumentar cantidad"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                  </button>
                </div>

                <div className="text-xs text-neutral-muted">
                  Total estimado:{' '}
                  <strong className="text-neutral-dark">${totalCalculatedUsd}</strong> (Bs. {totalCalculatedBcv})
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 ${
                  addedFeedbackActive
                    ? 'bg-accent-bright text-neutral-dark'
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {addedFeedbackActive ? 'check_circle' : 'add_shopping_cart'}
                </span>
                <span>{addedFeedbackActive ? '¡Producto Agregado al Carrito!' : 'Agregar a Mi Lista de Compra'}</span>
              </button>

              <a
                href={directProductWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                <span>Pedir Directo por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {relatedProductsList.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-accent uppercase tracking-widest">
                  Misma Categoría
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-neutral-dark">
                  Productos Relacionados que te Pueden Gustar
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProductsList.map((relatedItem) => (
                <button
                  key={relatedItem.productIdentifier}
                  type="button"
                  onClick={() => onSelectProduct(relatedItem)}
                  className="bg-white rounded-xl border border-neutral-border p-4 flex flex-col text-left shadow-xs hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-full aspect-[4/3] rounded-lg bg-surface-alt overflow-hidden mb-3">
                    <img
                      src={relatedItem.productImage}
                      alt={relatedItem.productTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase">
                    {relatedItem.productCategoryName}
                  </span>
                  <h4 className="text-sm font-bold text-neutral-dark group-hover:text-primary transition-colors mt-0.5 line-clamp-1">
                    {relatedItem.productTitle}
                  </h4>
                  <div className="text-base font-black text-neutral-dark mt-2">
                    ${relatedItem.productPriceUsd.toFixed(2)}{' '}
                    <span className="text-[10px] font-normal text-neutral-muted">/ {relatedItem.productPriceUnit}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {isImageZoomModalOpen && (
        <div
          onClick={handleCloseZoomModal}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-fadeIn"
        >
          <div className="w-full flex items-center justify-between z-10">
            <div className="text-white">
              <h3 className="text-base sm:text-lg font-bold truncate max-w-xs sm:max-w-md">
                {productItem.productTitle}
              </h3>
              <p className="text-xs text-white/70">
                Zoom interactivo: {Math.round(zoomMagnificationFactor * 100)}% • Clic o arrastra para explorar
              </p>
            </div>

            <button
              type="button"
              onClick={handleCloseZoomModal}
              className="w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
              aria-label="Cerrar zoom"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          <div
            onClick={(clickEvent) => clickEvent.stopPropagation()}
            onMouseDown={handleMouseDownOnImage}
            onMouseMove={handleMouseMoveOnImage}
            onMouseUp={handleMouseUpOnImage}
            onMouseLeave={handleMouseUpOnImage}
            className={`relative flex-1 w-full flex items-center justify-center overflow-hidden my-4 ${
              zoomMagnificationFactor > 1 ? (isDraggingImage ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
            }`}
          >
            <img
              src={productItem.productImage}
              alt={productItem.productTitle}
              onClick={handleToggleZoomOnClick}
              style={{
                transform: `scale(${zoomMagnificationFactor}) translate(${panTranslatePosition.horizontalCoordinate / zoomMagnificationFactor}px, ${panTranslatePosition.verticalCoordinate / zoomMagnificationFactor}px)`,
                transition: isDraggingImage ? 'none' : 'transform 0.25s ease-out'
              }}
              className="max-h-[82vh] max-w-full object-contain rounded-xl shadow-2xl pointer-events-auto"
            />
          </div>

          <div
            onClick={(clickEvent) => clickEvent.stopPropagation()}
            className="bg-black/70 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 flex items-center gap-3 text-white shadow-2xl z-10"
          >
            <button
              type="button"
              onClick={handleZoomOutAction}
              disabled={zoomMagnificationFactor <= 1}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              aria-label="Reducir zoom"
            >
              <span className="material-symbols-outlined text-xl">zoom_out</span>
            </button>

            <span className="text-xs font-mono font-bold w-14 text-center">
              {Math.round(zoomMagnificationFactor * 100)}%
            </span>

            <button
              type="button"
              onClick={handleZoomInAction}
              disabled={zoomMagnificationFactor >= 3.5}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              aria-label="Aumentar zoom"
            >
              <span className="material-symbols-outlined text-xl">zoom_in</span>
            </button>

            <div className="w-px h-6 bg-white/20 mx-1"></div>

            <button
              type="button"
              onClick={handleResetZoomAction}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-base">restart_alt</span>
              <span>100%</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
