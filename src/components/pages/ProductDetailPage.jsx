import React, { useState, useEffect } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import productsCatalogData from '../../data/productsCatalogData.json';

const PRESET_WEIGHTS = [
  { key: '250g', label: '250g (1/4 Kg)', grams: 250, factor: 0.25, shortLabel: '250g' },
  { key: '500g', label: '500g (1/2 Kg)', grams: 500, factor: 0.50, shortLabel: '500g' },
  { key: '1kg', label: '1 Kg (Entero)', grams: 1000, factor: 1.00, shortLabel: '1 Kg' },
  { key: 'custom', label: 'Personalizado', grams: 350, factor: 0.35, shortLabel: 'Personalizado' }
];

export const ProductDetailPage = ({
  productItem,
  onBackToStore,
  onSelectProduct
}) => {
  const { addProductToCart, exchangeRateBcv } = useShoppingCart();

  const isWeightBasedProduct = productItem?.departmentIdentifier === 'quesos-lacteos' && productItem?.productPriceUnit?.toLowerCase() === 'kg';

  const [selectedPresetKey, setSelectedPresetKey] = useState('500g');
  const [customGramsInput, setCustomGramsInput] = useState(350);
  const [productQuantity, setProductQuantity] = useState(1);
  const [productInstructionNote, setProductInstructionNote] = useState('');
  const [addedFeedbackActive, setAddedFeedbackActive] = useState(false);
  const [isImageZoomModalOpen, setIsImageZoomModalOpen] = useState(false);
  const [zoomMagnificationFactor, setZoomMagnificationFactor] = useState(1);
  const [panTranslatePosition, setPanTranslatePosition] = useState({ horizontalCoordinate: 0, verticalCoordinate: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragOriginCoordinate, setDragOriginCoordinate] = useState({ horizontalStart: 0, verticalStart: 0 });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setProductQuantity(1);
    setProductInstructionNote('');
    setIsImageZoomModalOpen(false);
    setZoomMagnificationFactor(1);
    setPanTranslatePosition({ horizontalCoordinate: 0, verticalCoordinate: 0 });
    setSelectedPresetKey('500g');
    setCustomGramsInput(350);
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

  const configuredPhoneNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || '584146770016';
  const cleanDestinationNumber = configuredPhoneNumber.replace(/[^\d]/g, '');

  const isCustomActive = selectedPresetKey === 'custom';
  const effectiveGrams = isCustomActive
    ? Math.max(50, Math.min(customGramsInput || 100, 10000))
    : (PRESET_WEIGHTS.find((p) => p.key === selectedPresetKey)?.grams || 500);

  const effectiveFactor = isWeightBasedProduct ? effectiveGrams / 1000 : 1;

  const portionLabel = isWeightBasedProduct
    ? (isCustomActive
        ? (effectiveGrams >= 1000 ? `${(effectiveGrams / 1000).toFixed(2)} Kg (Personalizado)` : `${effectiveGrams}g (Personalizado)`)
        : (PRESET_WEIGHTS.find((p) => p.key === selectedPresetKey)?.label || `${effectiveGrams}g`))
    : '';

  const fractionKey = isCustomActive ? `custom_${effectiveGrams}g` : selectedPresetKey;

  const effectiveUnitPriceUsd = isWeightBasedProduct
    ? productItem.productPriceUsd * effectiveFactor
    : productItem.productPriceUsd;

  const priceBcvEquivalent = (effectiveUnitPriceUsd * exchangeRateBcv).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const totalCalculatedUsd = (effectiveUnitPriceUsd * productQuantity).toFixed(2);
  const totalCalculatedBcv = (effectiveUnitPriceUsd * productQuantity * exchangeRateBcv).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleIncrementQuantity = () => {
    setProductQuantity((previousQuantity) => previousQuantity + 1);
  };

  const handleDecrementQuantity = () => {
    setProductQuantity((previousQuantity) => (previousQuantity > 1 ? previousQuantity - 1 : 1));
  };

  const handleDecreaseCustomGrams = () => {
    setCustomGramsInput((prev) => Math.max(50, (prev || 350) - 50));
  };

  const handleIncreaseCustomGrams = () => {
    setCustomGramsInput((prev) => Math.min(10000, (prev || 350) + 50));
  };

  const handleAddToCart = (clickEvent) => {
    const buttonBoundingRect = clickEvent?.currentTarget?.getBoundingClientRect();
    const originCoordinates = buttonBoundingRect ? {
      coordinateX: buttonBoundingRect.left + buttonBoundingRect.width / 2,
      coordinateY: buttonBoundingRect.top + buttonBoundingRect.height / 2,
      cardStartX: buttonBoundingRect.left - 40,
      cardStartY: buttonBoundingRect.top - 60,
      cardWidth: Math.max(buttonBoundingRect.width, 220),
      cardHeight: 280
    } : null;

    const weightFraction = isWeightBasedProduct ? {
      fractionKey,
      label: portionLabel,
      factor: effectiveFactor,
      grams: effectiveGrams
    } : null;

    addProductToCart(
      productItem,
      productQuantity,
      productQuantity,
      originCoordinates,
      productInstructionNote,
      {
        weightFraction
      }
    );

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

  const portionDesc = isWeightBasedProduct ? ` [${portionLabel}]` : '';
  const formattedNoteSuffix = productInstructionNote.trim() ? ` (Nota: ${productInstructionNote.trim()})` : '';
  const directProductWhatsAppUrl = `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent(
    `Hola Quesería San Joaquín! Quisiera ordenar: ${productQuantity}x ${productItem.productTitle}${portionDesc}${formattedNoteSuffix}. Total: $${totalCalculatedUsd} (Bs. ${totalCalculatedBcv}).`
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

          <div className="lg:col-span-6 flex flex-col space-y-5">
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

            {/* Tarjeta de Precio Dinámica */}
            <div className="p-4 rounded-2xl bg-surface-alt border border-neutral-border flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-neutral-muted uppercase font-bold block">
                  {isWeightBasedProduct ? `Precio por ${portionLabel}` : `Precio por ${productItem.productPriceUnit}`}
                </span>
                <div className="text-2xl sm:text-3xl font-black text-neutral-dark leading-tight">
                  ${effectiveUnitPriceUsd.toFixed(2)}{' '}
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

            {/* Selector de Peso Fraccionado + Personalizado */}
            {isWeightBasedProduct && (
              <div className="space-y-3 p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-neutral-dark uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base text-primary">scale</span>
                    <span>Elige tu Porción o Personaliza:</span>
                  </label>
                  <span className="text-xs font-black text-primary">{portionLabel}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_WEIGHTS.map((preset) => {
                    const isSelected = selectedPresetKey === preset.key;
                    const presetPrice = preset.key === 'custom'
                      ? null
                      : (productItem.productPriceUsd * preset.factor).toFixed(2);

                    return (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => setSelectedPresetKey(preset.key)}
                        className={`py-2.5 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs ring-2 ring-primary/20 scale-[1.02]'
                            : 'bg-white text-neutral-700 border-neutral-200 hover:border-primary/50 hover:bg-neutral-50'
                        }`}
                      >
                        <span className="block text-xs font-black leading-tight">{preset.shortLabel}</span>
                        {presetPrice ? (
                          <span className={`block text-[10px] mt-0.5 font-semibold ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                            ${presetPrice}
                          </span>
                        ) : (
                          <span className={`block text-[10px] mt-0.5 font-semibold ${isSelected ? 'text-amber-300' : 'text-primary'}`}>
                            Al gramo
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Input para gramos personalizados */}
                {isCustomActive && (
                  <div className="p-3 bg-white border border-emerald-300 rounded-xl space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-emerald-950">Escribe los gramos que deseas:</span>
                      <span className="font-extrabold text-emerald-700">
                        {effectiveGrams >= 1000 ? `${(effectiveGrams / 1000).toFixed(2)} Kg` : `${effectiveGrams}g`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleDecreaseCustomGrams}
                        className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold hover:bg-emerald-100 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                      >
                        -50g
                      </button>

                      <div className="flex-1 relative">
                        <input
                          type="number"
                          min="50"
                          max="10000"
                          step="10"
                          value={customGramsInput}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setCustomGramsInput(isNaN(val) ? '' : val);
                          }}
                          className="w-full bg-surface-alt border-2 border-emerald-400 rounded-xl py-2 px-3 text-center text-sm font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="350"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 pointer-events-none">
                          gramos
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleIncreaseCustomGrams}
                        className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold hover:bg-emerald-100 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                      >
                        +50g
                      </button>
                    </div>

                    {/* Botones de acceso rápido */}
                    <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                      {[150, 300, 350, 400, 750, 1500].map((quickGrams) => (
                        <button
                          key={quickGrams}
                          type="button"
                          onClick={() => setCustomGramsInput(quickGrams)}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                        >
                          {quickGrams >= 1000 ? `${quickGrams / 1000}kg` : `${quickGrams}g`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Selector de Cantidad de Paquetes */}
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

            {/* Nota Especial */}
            <div className="space-y-1.5 pt-2 border-t border-neutral-100">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-600 block">
                  Instrucción o indicación especial (opcional):
                </label>
                {productInstructionNote && (
                  <button
                    type="button"
                    onClick={() => setProductInstructionNote('')}
                    className="text-[10px] text-red-600 font-bold hover:underline cursor-pointer"
                  >
                    Borrar
                  </button>
                )}
              </div>

              <input
                type="text"
                value={productInstructionNote}
                onChange={(inputEvent) => setProductInstructionNote(inputEvent.target.value)}
                placeholder="Ej: punto de sal, empaque sellado, etc."
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#114B2B]"
              />
            </div>

            {/* Botones de Acción */}
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

        {/* Productos Relacionados */}
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
                  className="bg-white rounded-2xl border border-neutral-200 p-4 text-left hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="w-full aspect-square rounded-xl bg-surface-alt overflow-hidden mb-3">
                    <img
                      src={relatedItem.productImage}
                      alt={relatedItem.productTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase block mb-1">
                    {relatedItem.productCategoryName}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-dark line-clamp-1 group-hover:text-primary transition-colors">
                    {relatedItem.productTitle}
                  </h4>
                  <div className="mt-2 text-sm font-black text-neutral-dark">
                    ${relatedItem.productPriceUsd.toFixed(2)}{' '}
                    <span className="text-[10px] font-normal text-neutral-muted">/ {relatedItem.productPriceUnit}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Zoom */}
      {isImageZoomModalOpen && (
        <div
          onClick={handleCloseZoomModal}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6"
        >
          <div className="w-full max-w-5xl flex items-center justify-between text-white pb-3">
            <div className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-xl text-emerald-400">zoom_in</span>
              <h3 className="text-xs sm:text-sm font-bold truncate">{productItem.productTitle}</h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/20">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleZoomOutAction(); }}
                  className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
                  aria-label="Alejar"
                >
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <span className="text-[11px] font-bold px-2 text-white/90">
                  {Math.round(zoomMagnificationFactor * 100)}%
                </span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleZoomInAction(); }}
                  className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-lg cursor-pointer transition-colors"
                  aria-label="Acercar"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleResetZoomAction(); }}
                  className="px-2 py-1 text-[10px] font-bold text-white/80 hover:text-white hover:bg-white/20 rounded-lg ml-1 cursor-pointer transition-colors"
                >
                  Reset
                </button>
              </div>

              <button
                type="button"
                onClick={handleCloseZoomModal}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Cerrar zoom"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDownOnImage}
            onMouseMove={handleMouseMoveOnImage}
            onMouseUp={handleMouseUpOnImage}
            onMouseLeave={handleMouseUpOnImage}
            className={`w-full max-w-5xl flex-1 flex items-center justify-center overflow-hidden select-none ${
              zoomMagnificationFactor > 1 ? (isDraggingImage ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
            }`}
          >
            <img
              src={productItem.productImage}
              alt={productItem.productTitle}
              onClick={handleToggleZoomOnClick}
              style={{
                transform: `translate(${panTranslatePosition.horizontalCoordinate}px, ${panTranslatePosition.verticalCoordinate}px) scale(${zoomMagnificationFactor})`,
                transition: isDraggingImage ? 'none' : 'transform 200ms ease-out'
              }}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl pointer-events-auto"
              draggable={false}
            />
          </div>

          <div className="text-white/60 text-[11px] pt-2 text-center">
            Haz clic para ampliar • Arrastra para mover la imagen cuando tenga zoom activo
          </div>
        </div>
      )}
    </div>
  );
};
