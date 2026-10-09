import React from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import { CartItemRow } from './CartItemRow';
import { buildWhatsAppOrderUrl } from '../../services/whatsappOrderService';

export const CartDrawerModal = () => {
  const {
    cartItemList,
    isCartDrawerOpen,
    closeCartDrawer,
    clearCartItems,
    totalItemsCount,
    rawSubtotalUsd,
    appliedCombosList,
    totalComboDiscountUsd,
    totalCartAmountUsd,
    exchangeRateBcv,
    preferredCurrency
  } = useShoppingCart();

  const finalTotalUsd = totalCartAmountUsd;
  const finalTotalBcv = finalTotalUsd * exchangeRateBcv;

  const handleSendOrderToWhatsApp = (clickEvent) => {
    clickEvent.preventDefault();

    if (cartItemList.length === 0) {
      return;
    }

    const targetWhatsAppUrl = buildWhatsAppOrderUrl({
      cartItemList,
      customerFullName: '',
      deliveryAddressText: '',
      selectedPaymentMethod: '',
      exchangeRateBcv,
      orderNotesText: '',
      fulfillmentType: 'none',
      selectedZone: null,
      pickupEstimatedTime: '',
      deliveryCostUsd: 0,
      appliedCombosList,
      totalComboDiscountUsd
    });

    window.open(targetWhatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  const formattedTotalBcv = finalTotalBcv.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const formattedExchangeRateBcv = typeof exchangeRateBcv === 'number'
    ? exchangeRateBcv.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '866,56';

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isCartDrawerOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
      }`}
    >
      <div
        onClick={closeCartDrawer}
        className={`absolute inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity duration-300 ${
          isCartDrawerOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="fixed inset-y-0 right-0 w-full sm:max-w-md flex">
        <div
          className={`w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
            isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-5 py-4 bg-white text-neutral-900 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-2xl text-[#3B7011]">shopping_cart</span>
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">Mi Carrito</h3>
                <span className="text-[11px] text-neutral-400 font-semibold">
                  {totalItemsCount} {totalItemsCount === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>

            <button
              onClick={closeCartDrawer}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <div id="tour-cart-scroll-container" className="flex-1 overflow-y-auto px-5 py-4 scrollbar-none">
            {cartItemList.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-5xl text-neutral-300 mb-2">remove_shopping_cart</span>
                <h4 className="text-sm font-bold text-neutral-800">Tu carrito está vacío</h4>
                <p className="text-xs text-neutral-400 mt-1 mb-6">
                  Agrega víveres frescos o charcutería al gusto para iniciar tu pedido.
                </p>
                <button
                  onClick={closeCartDrawer}
                  className="px-5 py-2.5 bg-[#8DC63F] hover:bg-[#78AD2F] text-[#062612] text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs border border-[#78AD2F]/30"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              <div>
                {appliedCombosList.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {appliedCombosList.map((appliedComboItem) => (
                      <div
                        key={appliedComboItem.promoIdentifier}
                        className="p-3 bg-[#F2F9E6] border border-[#8DC63F]/40 rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#8DC63F] text-[#062612] flex items-center justify-center shrink-0 font-bold">
                            <span className="material-symbols-outlined text-lg">celebration</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-neutral-900 leading-tight">
                                ¡{appliedComboItem.promoTitle} detectado!
                              </span>
                              {appliedComboItem.completedCombos > 1 && (
                                <span className="text-[10px] bg-[#8DC63F] text-[#062612] font-black px-1.5 py-0.5 rounded-full">
                                  x{appliedComboItem.completedCombos}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-neutral-600 mt-0.5 flex items-center gap-1.5 flex-wrap">
                              <span>Suma regular: <span className="line-through font-semibold text-neutral-400">${appliedComboItem.regularBundlePrice.toFixed(2)}</span></span>
                              <span>•</span>
                              <span className="text-[#062612] font-black bg-white/90 border border-[#8DC63F]/40 px-1.5 py-0.5 rounded">
                                Ahorras -${appliedComboItem.discountAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-emerald-800 block">
                            ${appliedComboItem.finalComboPrice.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-bold text-neutral-400 block">
                            Bs. {(appliedComboItem.finalComboPrice * exchangeRateBcv).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div id="tour-items-list-header" className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-100">
                  <span className="text-xs font-bold text-neutral-800">Productos en tu carrito</span>
                  <button
                    id="tour-clear-cart-btn"
                    onClick={clearCartItems}
                    className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Vaciar todo
                  </button>
                </div>

                <div id="tour-cart-items-list" className="divide-y divide-neutral-100">
                  {cartItemList.map((cartEntryItem) => (
                    <CartItemRow
                      key={cartEntryItem.cartItemKey || cartEntryItem.productIdentifier}
                      cartItemEntry={cartEntryItem}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {cartItemList.length > 0 && (
            <div className="p-5 border-t border-neutral-100 bg-white space-y-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
                  <span>Subtotal productos:</span>
                  <span className={`font-bold ${totalComboDiscountUsd > 0 ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>
                    ${rawSubtotalUsd.toFixed(2)}
                  </span>
                </div>

                {totalComboDiscountUsd > 0 && (
                  <div className="flex items-center justify-between text-xs font-bold text-[#062612] bg-[#F2F9E6] border border-[#8DC63F]/40 px-2.5 py-1.5 rounded-xl">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-[#3B7011]">savings</span>
                      <span>Descuento por Combos:</span>
                    </span>
                    <span className="font-black text-[#062612]">-${totalComboDiscountUsd.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
                  <span>Tasa Oficial BCV:</span>
                  <span>Bs. {formattedExchangeRateBcv}</span>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100">
                  <div>
                    <span className="text-sm font-black text-neutral-900 block leading-none">Total General</span>
                    {preferredCurrency === 'BS' ? (
                      <span className="text-[11px] text-neutral-400 font-semibold mt-1 block">Ref. ${finalTotalUsd.toFixed(2)} USD</span>
                    ) : (
                      <span className="text-[11px] text-neutral-400 font-semibold mt-1 block">Bs. {formattedTotalBcv}</span>
                    )}
                  </div>
                  <span className="text-xl font-black text-neutral-900 leading-none">
                    {preferredCurrency === 'BS' ? `Bs. ${formattedTotalBcv}` : `$${finalTotalUsd.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <button
                id="tour-whatsapp-btn"
                onClick={handleSendOrderToWhatsApp}
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">chat</span>
                <span>Enviar Pedido al WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
