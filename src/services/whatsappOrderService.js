export const buildWhatsAppOrderUrl = ({
  cartItemList,
  customerFullName,
  deliveryAddressText,
  selectedPaymentMethod,
  exchangeRateBcv,
  orderNotesText
}) => {
  const configuredPhoneNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || '584147675878';
  const cleanDestinationNumber = configuredPhoneNumber.replace(/[^\d]/g, '');

  const totalAmountUsd = cartItemList.reduce((accumulatorAmount, currentItem) => {
    return accumulatorAmount + (currentItem.productPriceUsd * currentItem.selectedQuantity);
  }, 0);

  const totalAmountBcv = totalAmountUsd * exchangeRateBcv;

  const orderLinesText = cartItemList.map((cartEntryItem) => {
    const itemSubtotalUsd = (cartEntryItem.productPriceUsd * cartEntryItem.selectedQuantity).toFixed(2);
    const cutSpecification = cartEntryItem.selectedCutOption ? ` [Corte: ${cartEntryItem.selectedCutOption}]` : '';
    return `• ${cartEntryItem.selectedQuantity}x ${cartEntryItem.productTitle}${cutSpecification} ($${itemSubtotalUsd})`;
  }).join('\n');

  const customerDetailSection = customerFullName ? `\n*Cliente:* ${customerFullName}` : '';
  const deliveryDetailSection = deliveryAddressText ? `\n*Dirección de Entrega:* ${deliveryAddressText}` : '';
  const paymentDetailSection = selectedPaymentMethod ? `\n*Método de Pago:* ${selectedPaymentMethod}` : '';
  const notesDetailSection = orderNotesText ? `\n*Nota Adicional:* ${orderNotesText}` : '';

  const fullOrderMessage = [
    '*PEDIDO QUESERÍA SAN JOAQUÍN*',
    'Mercado & Charcutería',
    '----------------------------------',
    customerDetailSection,
    deliveryDetailSection,
    paymentDetailSection,
    notesDetailSection,
    '----------------------------------',
    '*PRODUCTOS SOLICITADOS:*',
    orderLinesText,
    '----------------------------------',
    `*TOTAL USD:* $${totalAmountUsd.toFixed(2)}`,
    `*TOTAL BCV:* Bs. ${totalAmountBcv.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Tasa: Bs. ${exchangeRateBcv.toFixed(2)})`,
    '----------------------------------',
    'Por favor confirmar recepción y pesaje exacto para el despacho. ¡Muchas gracias!'
  ].filter(Boolean).join('\n');

  return `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent(fullOrderMessage)}`;
};
