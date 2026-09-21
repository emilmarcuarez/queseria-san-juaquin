import React, { useState, useEffect } from 'react';

const PRESET_WEIGHTS = [
  { key: '250g', label: '250g', sublabel: '¼ Kg', grams: 250, factor: 0.25 },
  { key: '500g', label: '500g', sublabel: '½ Kg', grams: 500, factor: 0.50 },
  { key: '1kg',  label: '1 Kg',  sublabel: 'Entero', grams: 1000, factor: 1.00 },
  { key: 'custom', label: 'A tu medida', sublabel: 'Personalizado', grams: 350, factor: 0.35 }
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
    const handleEscKeyDown = (keyEvent) => {
      if (keyEvent.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscKeyDown);
    return () => window.removeEventListener('keydown', handleEscKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !productItem) return null;

  const isCustomActive = selectedPresetKey === 'custom';

  const effectiveGrams = isCustomActive
    ? Math.max(50, Math.min(customGramsInput || 100, 10000))
    : (PRESET_WEIGHTS.find((preset) => preset.key === selectedPresetKey)?.grams || 500);

  const effectiveFactor = effectiveGrams / 1000;

  const portionLabel = isCustomActive
    ? (effectiveGrams >= 1000
        ? `${(effectiveGrams / 1000).toFixed(2)} Kg personalizado`
        : `${effectiveGrams}g personalizado`)
    : (PRESET_WEIGHTS.find((preset) => preset.key === selectedPresetKey)?.label || `${effectiveGrams}g`);

  const fractionKey = isCustomActive ? `custom_${effectiveGrams}g` : selectedPresetKey;

  const unitPriceUsd = productItem.productPriceUsd * effectiveFactor;
  const totalPriceUsd = unitPriceUsd * portionQuantity;
  const totalPriceBcv = totalPriceUsd * exchangeRateBcv;

  const formattedTotalBcv = totalPriceBcv.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleDecreaseCustomGrams = () => {
    setCustomGramsInput((previous) => Math.max(10, (previous || 100) - 50));
  };

  const handleIncreaseCustomGrams = () => {
    setCustomGramsInput((previous) => Math.min(10000, (previous || 350) + 50));
  };

  const handleCustomGramsChange = (changeEvent) => {
    const parsedValue = parseInt(changeEvent.target.value, 10);
    setCustomGramsInput(isNaN(parsedValue) ? '' : parsedValue);
  };

  const handleConfirm = () => {
    const weightFraction = {
      fractionKey,
      label: portionLabel,
      factor: effectiveFactor,
      grams: effectiveGrams
    };
    onConfirmAddToCart({ productItem, weightFraction, quantity: portionQuantity, customNote: customNote.trim() });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-neutral-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-sm bg-white sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col animate-slideDownDrawer"
        onClick={(clickEvent) => clickEvent.stopPropagation()}
      >
        {/* Handle bar for mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-neutral-200" />
        </div>

        {/* Header */}
        <div className="px-5 pt-4 pb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#114B2B]/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#114B2B] text-xl">scale</span>
            </div>
            <div>
              <h3 className="text-sm font-black text-neutral-900 leading-tight">Elige tu porción</h3>
              <p className="text-[11px] text-neutral-400 font-medium mt-0.5 truncate max-w-[190px]">
                {productItem.productTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center cursor-pointer transition-colors shrink-0"
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Price per kg strip */}
        <div className="mx-5 mb-4 px-3.5 py-2.5 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={productItem.productImage}
              alt={productItem.productTitle}
              className="w-9 h-9 object-cover rounded-lg border border-neutral-200"
            />
            <span className="text-xs font-semibold text-neutral-500">Precio por kg</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-neutral-900">${productItem.productPriceUsd.toFixed(2)}</span>
            <span className="text-[10px] text-neutral-400 block">
              Bs. {(productItem.productPriceUsd * exchangeRateBcv).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="px-5 pb-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Weight selector grid */}
          <div className="grid grid-cols-4 gap-2">
            {PRESET_WEIGHTS.map((preset) => {
              const isSelected = selectedPresetKey === preset.key;
              const presetPrice = preset.key !== 'custom'
                ? `$${(productItem.productPriceUsd * preset.factor).toFixed(2)}`
                : null;

              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => setSelectedPresetKey(preset.key)}
                  className={`py-3 px-1 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? 'bg-[#114B2B] border-[#114B2B] text-white shadow-sm scale-[1.03]'
                      : 'bg-white border-neutral-150 text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <span className="text-xs font-black leading-tight block">{preset.label}</span>
                  <span className={`text-[9px] font-medium ${isSelected ? 'text-white/70' : 'text-neutral-400'}`}>
                    {preset.sublabel}
                  </span>
                  {presetPrice && (
                    <span className={`text-[10px] font-bold mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-[#114B2B]'}`}>
                      {presetPrice}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom grams input */}
          {isCustomActive && (
            <div className="rounded-2xl border border-neutral-150 overflow-hidden">
              <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-700">Cantidad exacta</span>
                <span className="text-xs font-black text-[#114B2B]">
                  {effectiveGrams >= 1000 ? `${(effectiveGrams / 1000).toFixed(2)} kg` : `${effectiveGrams}g`}
                </span>
              </div>
              <div className="p-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecreaseCustomGrams}
                  className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  −50g
                </button>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    step="10"
                    value={customGramsInput}
                    onChange={handleCustomGramsChange}
                    className="w-full border border-neutral-200 rounded-xl py-2 pl-3 pr-10 text-center text-sm font-black text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#114B2B]/30 focus:border-[#114B2B] [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-neutral-400 pointer-events-none">g</span>
                </div>
                <button
                  type="button"
                  onClick={handleIncreaseCustomGrams}
                  className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  +50g
                </button>
              </div>
              <div className="px-3 pb-3 flex gap-1.5 flex-wrap">
                {[100, 150, 300, 400, 750, 1500].map((quickGrams) => (
                  <button
                    key={quickGrams}
                    type="button"
                    onClick={() => setCustomGramsInput(quickGrams)}
                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[10px] font-bold text-neutral-600 cursor-pointer transition-colors"
                  >
                    {quickGrams >= 1000 ? `${quickGrams / 1000}kg` : `${quickGrams}g`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-neutral-700 block">Cantidad</span>
              <span className="text-[10px] text-neutral-400">{portionQuantity}× {portionLabel}</span>
            </div>
            <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setPortionQuantity((quantity) => Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-white shadow-xs text-neutral-700 font-bold flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                −
              </button>
              <span className="w-8 text-center text-sm font-black text-neutral-900">{portionQuantity}</span>
              <button
                type="button"
                onClick={() => setPortionQuantity((quantity) => quantity + 1)}
                className="w-8 h-8 rounded-lg bg-white shadow-xs text-neutral-700 font-bold flex items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-500 block mb-1.5">
              Indicación especial <span className="text-neutral-400">(opcional)</span>
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(changeEvent) => setCustomNote(changeEvent.target.value)}
              placeholder="Ej: punto de sal, empaque sellado..."
              className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-neutral-800 placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#114B2B]/20 focus:border-[#114B2B]"
            />
          </div>

          {/* Subtotal */}
          <div className="rounded-2xl bg-[#114B2B]/5 border border-[#114B2B]/10 px-4 py-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-neutral-500 block">Total a pagar</span>
              <span className="text-[10px] text-neutral-400">Bs. {formattedTotalBcv}</span>
            </div>
            <span className="text-xl font-black text-[#114B2B]">${totalPriceUsd.toFixed(2)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-neutral-100 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-2xl border border-neutral-200 text-neutral-600 font-semibold text-xs hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#114B2B] hover:bg-[#0d3b22] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
            <span>Agregar · ${totalPriceUsd.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
