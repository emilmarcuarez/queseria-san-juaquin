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
    const itemNoteText = cartEntryItem.customItemNote && cartEntryItem.customItemNote.trim()
      ? `\n   ↳ 📝 Nota: ${cartEntryItem.customItemNote.trim()}`
      : '';
    return `• ${cartEntryItem.selectedQuantity}x ${cartEntryItem.productTitle} ($${itemSubtotalUsd})${itemNoteText}`;
  }).join('\n');

  const customerDetailSection = customerFullName && customerFullName.trim() ? `*Cliente:* ${customerFullName.trim()}` : '';
  const deliveryDetailSection = deliveryAddressText && deliveryAddressText.trim() ? `*Dirección de Entrega:* ${deliveryAddressText.trim()}` : '';
  const paymentDetailSection = selectedPaymentMethod && selectedPaymentMethod.trim() ? `*Método de Pago:* ${selectedPaymentMethod.trim()}` : '';
  const notesDetailSection = orderNotesText && orderNotesText.trim() ? `*Nota Adicional:* ${orderNotesText.trim()}` : '';

  const orderMetadataDetails = [
    customerDetailSection,
    deliveryDetailSection,
    paymentDetailSection,
    notesDetailSection
  ].filter(Boolean);

  const fullOrderMessage = [
    '*PEDIDO QUESERÍA SAN JOAQUÍN*',
    'Mercado & Charcutería',
    ...(orderMetadataDetails.length > 0 ? ['----------------------------------', ...orderMetadataDetails] : []),
    '----------------------------------',
    '*PRODUCTOS SOLICITADOS:*',
    orderLinesText,
    '----------------------------------',
    `*TOTAL USD:* $${totalAmountUsd.toFixed(2)}`,
    `*TOTAL BCV:* Bs. ${totalAmountBcv.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Tasa: Bs. ${exchangeRateBcv.toFixed(2)})`
  ].join('\n');

  return `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent(fullOrderMessage)}`;
};
