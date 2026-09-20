import React, { useState } from 'react';
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
    totalCartAmountUsd,
    totalCartAmountBcv,
    exchangeRateBcv
  } = useShoppingCart();

  const [customerFullName, setCustomerFullName] = useState('');
  const [deliveryAddressText, setDeliveryAddressText] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Pago Móvil');
  const [orderNotesText, setOrderNotesText] = useState('');

  const handleSendOrderToWhatsApp = (submitEvent) => {
    submitEvent.preventDefault();

    if (cartItemList.length === 0) {
      return;
    }

    const targetWhatsAppUrl = buildWhatsAppOrderUrl({
      cartItemList,
      customerFullName,
      deliveryAddressText,
      selectedPaymentMethod,
      exchangeRateBcv,
      orderNotesText
    });

    window.open(targetWhatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  const formattedTotalBcv = totalCartAmountBcv.toLocaleString('es-VE', {
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
          <div className="px-5 py-4 bg-primary text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-white">shopping_cart</span>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">Mi Lista de Compras</h3>
                <span className="text-[11px] text-white/80">
                  {totalItemsCount} {totalItemsCount === 1 ? 'producto' : 'productos'}
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

          <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-none">
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
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-border">
                  <span className="text-xs font-bold text-neutral-dark">Productos en lista</span>
                  <button
                    onClick={clearCartItems}
                    className="text-[11px] font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Vaciar todo
                  </button>
                </div>

                <div className="divide-y divide-neutral-border/60">
                  {cartItemList.map((cartEntryItem) => (
                    <CartItemRow
                      key={cartEntryItem.productIdentifier}
                      cartItemEntry={cartEntryItem}
                    />
                  ))}
                </div>

                <form onSubmit={handleSendOrderToWhatsApp} className="mt-6 pt-4 border-t border-neutral-border space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-primary">
                    Datos para Despacho Express
                  </h4>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-dark block mb-1">
                      Nombre y Apellido:
                    </label>
                    <input
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
                      Dirección de Entrega:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Av. 5 de Julio, Res. Paraíso, Apto 4B"
                      value={deliveryAddressText}
                      onChange={(inputEvent) => setDeliveryAddressText(inputEvent.target.value)}
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
                      <option value="Pago Móvil">Pago Móvil (Tasa BCV)</option>
                      <option value="Zelle">Zelle</option>
                      <option value="Efectivo USD">Efectivo USD</option>
                      <option value="Punto de Venta">Punto de Venta al recibir</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-dark block mb-1">
                      Notas Especiales (Opcional):
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Rebanar extra fino / Timbre blanco"
                      value={orderNotesText}
                      onChange={(inputEvent) => setOrderNotesText(inputEvent.target.value)}
                      className="w-full text-xs bg-surface-alt border border-neutral-border rounded-lg px-3 py-2 text-neutral-dark focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </form>
              </div>
            )}
          </div>

          {cartItemList.length > 0 && (
            <div className="p-5 border-t border-neutral-border bg-surface-alt space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-muted">
                  <span>Subtotal en Divisas:</span>
                  <span className="font-bold text-neutral-dark">${totalCartAmountUsd.toFixed(2)}</span>
                </div>
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
                    ${totalCartAmountUsd.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSendOrderToWhatsApp}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
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
