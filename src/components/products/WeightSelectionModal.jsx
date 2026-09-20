import React, { useState, useEffect } from 'react';

const PRESET_WEIGHTS = [
  { key: '250g', label: '250g (1/4 Kg)', grams: 250, factor: 0.25, shortLabel: '250g' },
  { key: '500g', label: '500g (1/2 Kg)', grams: 500, factor: 0.50, shortLabel: '500g' },
  { key: '1kg', label: '1 Kg (Entero)', grams: 1000, factor: 1.00, shortLabel: '1 Kg' },
  { key: 'custom', label: 'Personalizado', grams: 350, factor: 0.35, shortLabel: 'Personalizado' }
];

export const WeightSelectionModal = ({
  isOpen,
  onClose,
  productItem,
  exchangeRateBcv,
  onConfirmAddToCart
}) => {
  const [selectedPresetKey, setSelectedPresetKey] = useState('500g');
  const [customGramsInput, setCustomGramsInput] = useState(350);
  const [portionQuantity, setPortionQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedPresetKey('500g');
      setCustomGramsInput(350);
      setPortionQuantity(1);
      setCustomNote('');
    }
  }, [isOpen, productItem]);

  useEffect(() => {
    const handleEscKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscKeyDown);
    return () => window.removeEventListener('keydown', handleEscKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !productItem) {
    return null;
  }

  const isCustomActive = selectedPresetKey === 'custom';

  const effectiveGrams = isCustomActive
    ? Math.max(50, Math.min(customGramsInput || 100, 10000))
    : (PRESET_WEIGHTS.find((p) => p.key === selectedPresetKey)?.grams || 500);

  const effectiveFactor = effectiveGrams / 1000;

  const portionLabel = isCustomActive
    ? (effectiveGrams >= 1000 ? `${(effectiveGrams / 1000).toFixed(2)} Kg (Personalizado)` : `${effectiveGrams}g (Personalizado)`)
    : (PRESET_WEIGHTS.find((p) => p.key === selectedPresetKey)?.label || `${effectiveGrams}g`);

  const fractionKey = isCustomActive ? `custom_${effectiveGrams}g` : selectedPresetKey;

  const unitPriceUsd = productItem.productPriceUsd * effectiveFactor;
  const totalPriceUsd = unitPriceUsd * portionQuantity;
  const totalPriceBcv = totalPriceUsd * exchangeRateBcv;

  const formattedTotalBcv = totalPriceBcv.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleDecreaseCustomGrams = () => {
    setCustomGramsInput((prev) => Math.max(50, (prev || 350) - 50));
  };

  const handleIncreaseCustomGrams = () => {
    setCustomGramsInput((prev) => Math.min(10000, (prev || 350) + 50));
  };

  const handleCustomGramsChange = (e) => {
    const parsedVal = parseInt(e.target.value, 10);
    if (isNaN(parsedVal)) {
      setCustomGramsInput('');
    } else {
      setCustomGramsInput(parsedVal);
    }
  };

  const handleConfirm = () => {
    const weightFraction = {
      fractionKey,
      label: portionLabel,
      factor: effectiveFactor,
      grams: effectiveGrams
    };

    onConfirmAddToCart({
      productItem,
      weightFraction,
      quantity: portionQuantity,
      customNote: customNote.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-neutral-900/70 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col animate-slideDownDrawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div className="px-5 py-4 bg-primary text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-emerald-300">scale</span>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider">
                Selecciona el Peso Deseado
              </h3>
              <p className="text-[11px] text-white/80">
                Paga exacto los gramos que necesitas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Cerrar selector de peso"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Mini preview del producto */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface-alt border border-neutral-border">
            <img
              src={productItem.productImage}
              alt={productItem.productTitle}
              className="w-14 h-14 object-cover rounded-xl border border-neutral-border shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-primary uppercase block">
                {productItem.productCategoryName}
              </span>
              <h4 className="text-xs sm:text-sm font-black text-neutral-dark truncate">
                {productItem.productTitle}
              </h4>
              <div className="text-xs font-bold text-neutral-600 mt-0.5">
                ${productItem.productPriceUsd.toFixed(2)} / Kg{' '}
                <span className="text-[10px] text-emerald-800 font-semibold">
                  (Ref. BCV: Bs. {(productItem.productPriceUsd * exchangeRateBcv).toFixed(2)})
                </span>
              </div>
            </div>
          </div>

          {/* Opciones de Peso */}
          <div className="space-y-2">
            <label className="text-xs font-black text-neutral-dark uppercase tracking-wider block">
              1. Elige una porción o personaliza:
            </label>

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
                    <span className="text-xs font-black block leading-tight">{preset.shortLabel}</span>
                    {presetPrice ? (
                      <span className={`text-[10px] font-semibold ${isSelected ? 'text-white/80' : 'text-neutral-500'}`}>
                        ${presetPrice}
                      </span>
                    ) : (
                      <span className={`text-[10px] font-semibold ${isSelected ? 'text-amber-300' : 'text-primary'}`}>
                        Al gramo
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input para Peso Personalizado en Gramos */}
          {isCustomActive && (
            <div className="p-3.5 bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-950 flex items-center gap-1">
                  <span className="material-symbols-outlined text-base text-emerald-700">edit</span>
                  <span>Escribe los gramos exactos:</span>
                </span>
                <span className="text-xs font-extrabold text-emerald-800">
                  {effectiveGrams >= 1000 ? `${(effectiveGrams / 1000).toFixed(2)} Kg` : `${effectiveGrams} gramos`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecreaseCustomGrams}
                  className="w-10 h-10 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold hover:bg-emerald-100 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                  title="Restar 50 gramos"
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
                    onChange={handleCustomGramsChange}
                    className="w-full bg-white border-2 border-emerald-400 rounded-xl py-2 px-3 text-center text-base font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                    placeholder="350"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 pointer-events-none">
                    gramos
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleIncreaseCustomGrams}
                  className="w-10 h-10 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold hover:bg-emerald-100 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                  title="Sumar 50 gramos"
                >
                  +50g
                </button>
              </div>

              {/* Atajos rápidos en gramos */}
              <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1">
                {[150, 300, 350, 400, 750, 1500].map((quickGrams) => (
                  <button
                    key={quickGrams}
                    type="button"
                    onClick={() => setCustomGramsInput(quickGrams)}
                    className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-[10px] font-bold text-emerald-900 hover:bg-emerald-100 cursor-pointer"
                  >
                    {quickGrams >= 1000 ? `${quickGrams / 1000}kg` : `${quickGrams}g`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de Paquetes / Cantidad */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-alt border border-neutral-border">
            <div>
              <span className="text-xs font-black text-neutral-dark block leading-none">
                Cantidad de paquetes:
              </span>
              <span className="text-[10px] text-neutral-muted">
                {portionQuantity}x {portionLabel}
              </span>
            </div>

            <div className="flex items-center border border-neutral-border rounded-xl bg-white shadow-2xs">
              <button
                type="button"
                onClick={() => setPortionQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center text-neutral-dark hover:bg-neutral-100 rounded-l-xl font-bold cursor-pointer"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-black text-neutral-dark">
                {portionQuantity}
              </span>
              <button
                type="button"
                onClick={() => setPortionQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center text-neutral-dark hover:bg-neutral-100 rounded-r-xl font-bold cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Nota opcional para el charcutero */}
          <div>
            <label className="text-[11px] font-bold text-neutral-dark block mb-1">
              Indicación especial (Opcional):
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Ej: punto de sal, empaque sellado, etc."
              className="w-full text-xs bg-surface-alt border border-neutral-border rounded-xl px-3 py-2 text-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Resumen del Subtotal */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
              <span>Subtotal en Divisas:</span>
              <span className="text-sm font-black text-primary">${totalPriceUsd.toFixed(2)} USD</span>
            </div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800">
              <span>Total en Bolívares (Tasa BCV):</span>
              <span className="font-bold">Bs. {formattedTotalBcv}</span>
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="p-4 bg-surface-alt border-t border-neutral-border flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-3 px-4 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-100 transition-colors cursor-pointer text-center"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">add_shopping_cart</span>
            <span>Agregar al Carrito • ${totalPriceUsd.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
