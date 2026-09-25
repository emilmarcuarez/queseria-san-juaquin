import React, { useState } from 'react';
import { useShoppingCart } from '../../hooks/useShoppingCart';
import { CartItemRow } from './CartItemRow';
import {
  buildWhatsAppOrderUrl,
  MARACAIBO_DELIVERY_ZONES,
  PICKUP_TIME_SLOTS
} from '../../services/whatsappOrderService';
import { STORE_OFFICIAL_DATA } from '../../services/storeScheduleService';

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
    exchangeRateBcv
  } = useShoppingCart();

  const [fulfillmentType, setFulfillmentType] = useState('delivery'); // 'delivery' | 'pickup'
  const [selectedZoneId, setSelectedZoneId] = useState(MARACAIBO_DELIVERY_ZONES[0].zoneId);
  const [pickupEstimatedTime, setPickupEstimatedTime] = useState(PICKUP_TIME_SLOTS[0]);
  const [customerFullName, setCustomerFullName] = useState('');
  const [deliveryAddressText, setDeliveryAddressText] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [orderNotesText, setOrderNotesText] = useState('');
  const [copiedDataMessage, setCopiedDataMessage] = useState(false);

  const selectedZone = MARACAIBO_DELIVERY_ZONES.find((zone) => zone.zoneId === selectedZoneId) || MARACAIBO_DELIVERY_ZONES[0];
  const deliveryCostUsd = fulfillmentType === 'delivery' ? selectedZone.deliveryCostUsd : 0;
  const finalTotalUsd = totalCartAmountUsd + deliveryCostUsd;
  const finalTotalBcv = finalTotalUsd * exchangeRateBcv;

  const handleSendOrderToWhatsApp = (submitEvent) => {
    submitEvent.preventDefault();

    if (cartItemList.length === 0) {
      return;
    }

    const targetWhatsAppUrl = buildWhatsAppOrderUrl({
      cartItemList,
      customerFullName,
      deliveryAddressText: fulfillmentType === 'delivery' ? deliveryAddressText : '',
      selectedPaymentMethod,
      exchangeRateBcv,
      orderNotesText,
      fulfillmentType,
      selectedZone: fulfillmentType === 'delivery' ? selectedZone : null,
      pickupEstimatedTime,
      deliveryCostUsd,
      appliedCombosList,
      totalComboDiscountUsd
    });

    window.open(targetWhatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyPaymentData = () => {
    const paymentInfo = selectedPaymentMethod === 'Zelle'
      ? 'Zelle: queseriasanjuoquin@gmail.com / Titular: Quesería San Joaquín'
      : 'Pago Móvil: Banesco (0134) / CI: V-24.567.890 / Tlf: 0414-6770016';

    navigator.clipboard.writeText(paymentInfo).then(() => {
      setCopiedDataMessage(true);
      setTimeout(() => setCopiedDataMessage(false), 2000);
    }).catch(() => {});
  };

  const formattedTotalBcv = finalTotalBcv.toLocaleString('es-VE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-all duration-300 ${
        isCartDrawerOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
      }`}
    >
      <div
        onClick={closeCartDrawer}
        className={`absolute inset-0 bg-neutral-dark/60 backdrop-blur-xs transition-opacity duration-300 ${
          isCartDrawerOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="fixed inset-y-0 right-0 w-full sm:max-w-md flex">
        <div
          className={`w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
            isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header del Carrito */}
          <div className="px-5 py-4 bg-primary text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-white">shopping_cart</span>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Mi Lista de Compras</h3>
                <span className="text-[11px] text-white/80">
                  {totalItemsCount} {totalItemsCount === 1 ? 'ítem' : 'ítems'} seleccionados
                </span>
              </div>
            </div>

            <button
              onClick={closeCartDrawer}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Cuerpo del Carrito */}
          <div id="tour-cart-scroll-container" className="flex-1 overflow-y-auto px-5 py-4 scrollbar-none">
            {cartItemList.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-5xl text-neutral-muted mb-2">remove_shopping_cart</span>
                <h4 className="text-sm font-bold text-neutral-dark">Tu carrito está vacío</h4>
                <p className="text-xs text-neutral-muted mt-1 mb-6">
                  Agrega víveres frescos o charcutería al gusto para iniciar tu pedido.
                </p>
                <button
                  onClick={closeCartDrawer}
                  className="px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-all cursor-pointer"
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
                        className="p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#114B2B] text-white flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-lg">celebration</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-black text-neutral-900 leading-tight">
                                ¡{appliedComboItem.promoTitle} detectado!
                              </span>
                              {appliedComboItem.completedCombos > 1 && (
                                <span className="text-[10px] bg-[#114B2B] text-white font-extrabold px-1.5 py-0.5 rounded-full">
                                  x{appliedComboItem.completedCombos}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-neutral-600 mt-0.5 flex items-center gap-1.5 flex-wrap">
                              <span>Suma regular: <span className="line-through font-semibold text-neutral-500">${appliedComboItem.regularBundlePrice.toFixed(2)}</span></span>
                              <span>•</span>
                              <span className="text-emerald-800 font-extrabold bg-emerald-100/80 px-1.5 py-0.5 rounded">
                                Ahorras -${appliedComboItem.discountAmount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-[#114B2B] block">
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

                <div id="tour-items-list-header" className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-border">
                  <span className="text-xs font-bold text-neutral-dark">Productos en lista</span>
                  <button
                    id="tour-clear-cart-btn"
                    onClick={clearCartItems}
                    className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Vaciar todo
                  </button>
                </div>

                <div id="tour-cart-items-list" className="divide-y divide-neutral-border/60">
                  {cartItemList.map((cartEntryItem) => (
                    <CartItemRow
                      key={cartEntryItem.cartItemKey || cartEntryItem.productIdentifier}
                      cartItemEntry={cartEntryItem}
                    />
                  ))}
                </div>

                {/* Formulario de Checkout */}
                <form onSubmit={handleSendOrderToWhatsApp} className="mt-6 pt-4 border-t border-neutral-border space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-primary">
                      Modalidad y Despacho
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-medium">Maracaibo</span>
                  </div>

                  {/* Interruptor: Delivery vs Retiro en Tienda */}
                  <div id="tour-fulfillment-toggle" className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFulfillmentType('delivery')}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        fulfillmentType === 'delivery'
                          ? 'bg-white text-primary shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">moped</span>
                      <span>Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillmentType('pickup')}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        fulfillmentType === 'pickup'
                          ? 'bg-white text-primary shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      <span className="material-symbols-outlined text-base">storefront</span>
                      <span>Retiro en Tienda</span>
                    </button>
                  </div>

                  {fulfillmentType === 'delivery' ? (
                    <div className="space-y-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-dark block mb-1">
                          Zona / Parroquia de Entrega:
                        </label>
                        <select
                          value={selectedZoneId}
                          onChange={(changeEvent) => setSelectedZoneId(changeEvent.target.value)}
                          className="w-full text-xs font-medium bg-white border border-neutral-300 rounded-lg px-2.5 py-2 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {MARACAIBO_DELIVERY_ZONES.map((zone) => (
                            <option key={zone.zoneId} value={zone.zoneId}>
                              {zone.zoneName} (+${zone.deliveryCostUsd.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-neutral-dark block mb-1">
                          Dirección exacta & Punto de referencia:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ej: Av. 5 de Julio, Res. Paraíso, Apto 4B"
                          value={deliveryAddressText}
                          onChange={(changeEvent) => setDeliveryAddressText(changeEvent.target.value)}
                          className="w-full text-xs bg-white border border-neutral-300 rounded-lg px-3 py-2 text-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
                      <div className="flex items-start gap-2 text-emerald-950">
                        <span className="material-symbols-outlined text-lg text-emerald-700 mt-0.5 shrink-0">location_on</span>
                        <div className="text-xs">
                          <strong className="font-bold block text-neutral-900">Sede de Retiro (Gratis):</strong>
                          <span className="text-neutral-700 leading-tight block">
                            {STORE_OFFICIAL_DATA.shortAddress}
                          </span>
                          <span className="text-[10px] text-neutral-500 block mt-0.5">
                            Horario: Lun-Vie 7am-7pm | Sáb 7am-6pm
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-neutral-dark block mb-1">
                          Hora Estimada de Retiro:
                        </label>
                        <select
                          value={pickupEstimatedTime}
                          onChange={(changeEvent) => setPickupEstimatedTime(changeEvent.target.value)}
                          className="w-full text-xs font-medium bg-white border border-neutral-300 rounded-lg px-2.5 py-2 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {PICKUP_TIME_SLOTS.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div id="tour-customer-name-section">
                    <label className="text-[11px] font-bold text-neutral-dark block mb-1">
                      Tu Nombre y Apellido:
                    </label>
                    <input
                      id="tour-customer-name-input"
                      type="text"
                      required
                      placeholder="Ej: Carlos Silva"
                      value={customerFullName}
                      onChange={(inputEvent) => setCustomerFullName(inputEvent.target.value)}
                      className="w-full text-xs bg-surface-alt border border-neutral-border rounded-lg px-3 py-2 text-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-dark block mb-1">
                      Método de Pago Preferido:
                    </label>
                    <select
                      value={selectedPaymentMethod}
                      onChange={(selectEvent) => setSelectedPaymentMethod(selectEvent.target.value)}
                      className="w-full text-xs font-semibold bg-surface-alt border border-neutral-border rounded-lg px-3 py-2 text-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">Seleccionar método (opcional)</option>
                      <option value="Pago Móvil">Pago Móvil (Tasa Oficial BCV)</option>
                      <option value="Zelle">Zelle (USD)</option>
                      <option value="Efectivo USD">Efectivo USD (al recibir/retirar)</option>
                      <option value="Punto de Venta">Punto de Venta en tienda o entrega</option>
                    </select>
                  </div>

                  {/* Tarjeta de datos bancarios con botón copiar si selecciona Pago Móvil o Zelle */}
                  {(selectedPaymentMethod === 'Pago Móvil' || selectedPaymentMethod === 'Zelle') && (
                    <div className="p-2.5 rounded-lg bg-surface-alt border border-primary/20 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-primary block">
                          {selectedPaymentMethod === 'Zelle' ? 'Zelle San Joaquín' : 'Datos Pago Móvil'}
                        </span>
                        <span className="text-neutral-600 text-[10px]">
                          {selectedPaymentMethod === 'Zelle' ? 'queseriasanjuoquin@gmail.com' : 'Banesco • 0414-6770016 • V-24.567.890'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyPaymentData}
                        className="px-2 py-1 bg-white border border-neutral-300 hover:bg-neutral-50 rounded text-[10px] font-bold text-neutral-700 cursor-pointer"
                      >
                        {copiedDataMessage ? '¡Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-neutral-dark block mb-1">
                      Instrucción Especial Adicional (Opcional):
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Empacar bolsas separadas / Timbre blanco"
                      value={orderNotesText}
                      onChange={(inputEvent) => setOrderNotesText(inputEvent.target.value)}
                      className="w-full text-xs bg-surface-alt border border-neutral-border rounded-lg px-3 py-2 text-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer del Carrito con Totales y Botón WhatsApp */}
          {cartItemList.length > 0 && (
            <div className="p-5 border-t border-neutral-border bg-surface-alt space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-muted">
                  <span>Suma regular de productos:</span>
                  <span className={`font-bold ${totalComboDiscountUsd > 0 ? 'line-through text-neutral-400' : 'text-neutral-dark'}`}>
                    ${rawSubtotalUsd.toFixed(2)}
                  </span>
                </div>

                {totalComboDiscountUsd > 0 && (
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-xl">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-emerald-700">savings</span>
                      <span>Descuento por Combos:</span>
                    </span>
                    <span className="font-black text-emerald-800">-${totalComboDiscountUsd.toFixed(2)}</span>
                  </div>
                )}

                {totalComboDiscountUsd > 0 && (
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-muted">
                    <span>Subtotal con descuento:</span>
                    <span className="font-extrabold text-neutral-dark">${totalCartAmountUsd.toFixed(2)}</span>
                  </div>
                )}

                {fulfillmentType === 'delivery' ? (
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-muted">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">moped</span>
                      <span>Delivery ({selectedZone.zoneName.split('/')[0].trim()}):</span>
                    </span>
                    <span className="font-bold text-emerald-800">+${deliveryCostUsd.toFixed(2)}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs font-semibold text-neutral-muted">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-emerald-700">storefront</span>
                      <span>Retiro en Tienda:</span>
                    </span>
                    <span className="font-bold text-emerald-700">GRATIS ($0.00)</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs font-semibold text-neutral-muted">
                  <span>Tasa Oficial BCV:</span>
                  <span>Bs. {exchangeRateBcv.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-border/80">
                  <div>
                    <span className="text-sm font-extrabold text-neutral-dark block leading-none">Total General</span>
                    <span className="text-[11px] text-emerald-800 font-bold">Bs. {formattedTotalBcv}</span>
                  </div>
                  <span className="text-xl font-black text-primary leading-none">
                    ${finalTotalUsd.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                id="tour-whatsapp-btn"
                onClick={handleSendOrderToWhatsApp}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
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
