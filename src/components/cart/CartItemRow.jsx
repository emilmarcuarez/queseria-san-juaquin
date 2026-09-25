import React, { useState } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';

export const CartItemRow = ({ cartItemEntry }) => {
  const {
    updateItemQuantity,
    removeProductFromCart,
    updateCartItemNote,
    exchangeRateBcv
  } = useShoppingCart();

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [draftNoteText, setDraftNoteText] = useState(cartItemEntry.customItemNote || '');

  const itemKey = cartItemEntry.cartItemKey || cartItemEntry.productIdentifier;

  const itemSubtotalUsd = (cartItemEntry.productPriceUsd * cartItemEntry.selectedQuantity).toFixed(2);
  const itemSubtotalBcv = (
    cartItemEntry.productPriceUsd *
    cartItemEntry.selectedQuantity *
    exchangeRateBcv
  ).toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const itemStockLimit = cartItemEntry.availableStockQuantity ?? Infinity;

  const portionFactor = (cartItemEntry.basePriceUsd && cartItemEntry.basePriceUsd > 0)
    ? cartItemEntry.productPriceUsd / cartItemEntry.basePriceUsd
    : 1;
  const isWeightBasedItem = cartItemEntry.departmentIdentifier === 'quesos-lacteos' && cartItemEntry.productPriceUnit === 'kg';
  const kgConsumedByThisEntry = isWeightBasedItem
    ? cartItemEntry.selectedQuantity * portionFactor
    : cartItemEntry.selectedQuantity;

  const remainingStock = itemStockLimit === Infinity ? Infinity : Math.max(0, itemStockLimit - kgConsumedByThisEntry);
  const isAtStockLimit = itemStockLimit !== Infinity && remainingStock <= 0;

  const formatRemainingStock = (amount) => {
    if (!isWeightBasedItem) return `${Math.round(amount)}`;
    if (amount === Math.floor(amount)) return `${amount} kg`;
    return `${amount.toFixed(2).replace(/\.?0+$/, '')} kg`;
  };

  const handleDecreaseQuantity = () => {
    updateItemQuantity(itemKey, cartItemEntry.selectedQuantity - 1);
  };

  const handleIncreaseQuantity = () => {
    if (isAtStockLimit) return;
    updateItemQuantity(itemKey, cartItemEntry.selectedQuantity + 1);
  };

  const handleRemoveItem = () => {
    removeProductFromCart(itemKey);
  };

  const handleOpenNoteModal = () => {
    setDraftNoteText(cartItemEntry.customItemNote || '');
    setIsNoteModalOpen(true);
  };

  const handleCloseNoteModal = () => {
    setDraftNoteText(cartItemEntry.customItemNote || '');
    setIsNoteModalOpen(false);
  };

  const handleSaveNote = () => {
    updateCartItemNote(itemKey, draftNoteText.trim());
    setIsNoteModalOpen(false);
  };

  const handleClearNote = () => {
    updateCartItemNote(itemKey, '');
    setDraftNoteText('');
    setIsNoteModalOpen(false);
  };

  return (
    <>
      <div className="py-3 border-b border-neutral-border last:border-b-0 space-y-2">
        <div className="flex items-center gap-3">
          <img
            src={cartItemEntry.productImage}
            alt={cartItemEntry.productTitle}
            className="w-14 h-14 object-cover rounded-lg bg-surface-alt shrink-0 border border-neutral-border"
          />

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-neutral-dark truncate leading-tight">
              {cartItemEntry.productTitle}
            </h4>

            {/* Badge de Peso / Porción */}
            {cartItemEntry.portionLabel && (
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="material-symbols-outlined text-[12px]">scale</span>
                  <span>Peso: {cartItemEntry.portionLabel}</span>
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-black text-neutral-dark">
                ${itemSubtotalUsd}
              </span>
              <span className="text-[10px] font-semibold text-neutral-muted">
                Bs. {itemSubtotalBcv}
              </span>
            </div>
            {isAtStockLimit && (
              <span className="text-[9px] font-bold text-amber-600 mt-0.5 block">Stock agotado</span>
            )}
            {!isAtStockLimit && itemStockLimit !== Infinity && (
              <span className="text-[9px] font-medium text-neutral-400 mt-0.5 block">
                Stock: {formatRemainingStock(remainingStock)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center border border-neutral-border rounded-lg bg-surface-alt overflow-hidden">
              <button
                onClick={handleDecreaseQuantity}
                className="w-7 h-7 flex items-center justify-center text-neutral-dark hover:bg-neutral-border/50 text-sm font-bold cursor-pointer"
                aria-label="Disminuir cantidad"
              >
                -
              </button>
              <span className="w-7 text-center text-xs font-bold text-neutral-dark">
                {cartItemEntry.selectedQuantity}
              </span>
              <button
                onClick={handleIncreaseQuantity}
                disabled={isAtStockLimit}
                className={`w-7 h-7 flex items-center justify-center text-sm font-bold transition-colors ${
                  isAtStockLimit
                    ? 'text-neutral-300 cursor-not-allowed'
                    : 'text-neutral-dark hover:bg-neutral-border/50 cursor-pointer'
                }`}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>

            <button
              onClick={handleRemoveItem}
              className="text-neutral-muted hover:text-red-600 p-1 transition-colors cursor-pointer"
              aria-label="Eliminar producto"
            >
              <span className="material-symbols-outlined text-base">delete</span>
            </button>
          </div>
        </div>

        <div className="pl-1">
          {cartItemEntry.customItemNote ? (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg px-2.5 py-1.5 flex items-start justify-between gap-2 text-xs">
              <div className="flex items-start gap-1.5 min-w-0 text-emerald-950">
                <span className="material-symbols-outlined text-sm text-emerald-700 mt-0.5 shrink-0">
                  sticky_note_2
                </span>
                <span className="text-[11px] font-medium break-words leading-tight">
                  <strong className="font-bold text-emerald-900">Nota:</strong> {cartItemEntry.customItemNote}
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-1">
                <button
                  type="button"
                  onClick={handleOpenNoteModal}
                  className="text-[10px] font-bold text-emerald-800 hover:text-emerald-950 hover:underline cursor-pointer"
                >
                  Editar
                </button>
                <span className="text-emerald-300 text-[10px]">•</span>
                <button
                  type="button"
                  onClick={handleClearNote}
                  className="text-[10px] text-emerald-600 hover:text-red-600 cursor-pointer"
                  aria-label="Eliminar nota del producto"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              data-tour="add-note-btn"
              onClick={handleOpenNoteModal}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-500 hover:text-[#114B2B] hover:bg-neutral-100/80 px-2 py-1 rounded-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">edit_note</span>
              <span>Añadir nota o preferencia</span>
            </button>
          )}
        </div>
      </div>

      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-neutral-200 p-5 space-y-4 animate-slideDownDrawer"
            onClick={(clickEvent) => clickEvent.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                  <h3 className="text-sm font-bold text-neutral-dark">
                    Nota para este Producto
                  </h3>
                </div>
                <p className="text-xs text-neutral-muted mt-0.5 truncate font-medium max-w-[260px]">
                  {cartItemEntry.productTitle}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseNoteModal}
                className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Cerrar modal de nota"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-neutral-dark block">
                Indicación o preferencia especial:
              </label>
              <textarea
                value={draftNoteText}
                onChange={(inputEvent) => setDraftNoteText(inputEvent.target.value)}
                placeholder="Ej: Rebanar extra fino, empaque separado, punto de sal..."
                rows={3}
                maxLength={140}
                autoFocus
                className="w-full text-xs bg-surface-alt border border-neutral-300 rounded-xl p-3 text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-2xs"
              />
              <div className="flex justify-end">
                <span className="text-[10px] text-neutral-400 font-medium">
                  {draftNoteText.length} / 140
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100">
              {cartItemEntry.customItemNote ? (
                <button
                  type="button"
                  onClick={handleClearNote}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline cursor-pointer"
                >
                  Quitar nota
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCloseNoteModal}
                  className="text-xs font-semibold text-neutral-500 hover:text-neutral-700 cursor-pointer"
                >
                  Cancelar
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveNote}
                className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Guardar Nota
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
