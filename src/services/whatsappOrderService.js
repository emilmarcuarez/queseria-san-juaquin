export const MARACAIBO_DELIVERY_ZONES = [
  { zoneId: 'zona-norte-1', zoneName: 'Cecilio Acosta / Bella Vista / 5 de Julio / Tierra Negra', deliveryCostUsd: 2.00 },
  { zoneId: 'zona-norte-2', zoneName: 'Delicias / Indio Mara / Paraíso / Santa Rita', deliveryCostUsd: 2.00 },
  { zoneId: 'zona-este', zoneName: 'La Lago / Don Bosco / El Milagro / Zapara', deliveryCostUsd: 2.50 },
  { zoneId: 'zona-oeste-1', zoneName: 'La Limpia / Curva de Molina / Grano de Oro', deliveryCostUsd: 3.00 },
  { zoneId: 'zona-c1-c2', zoneName: 'Circunvalación 1 / Circunvalación 2', deliveryCostUsd: 3.00 },
  { zoneId: 'zona-sur-1', zoneName: 'Sabaneta / Pomona / Los Haticos', deliveryCostUsd: 3.50 },
  { zoneId: 'san-francisco', zoneName: 'San Francisco / Sierra Maestra / Coromoto', deliveryCostUsd: 4.00 },
  { zoneId: 'otra-zona', zoneName: 'Otra zona de Maracaibo (Tarifa base)', deliveryCostUsd: 2.50 }
];

export const PICKUP_TIME_SLOTS = [
  'En 30 - 45 minutos',
  'En 1 - 2 horas',
  'En la mañana (9:00 AM - 12:00 PM)',
  'En la tarde (2:00 PM - 5:00 PM)',
  'Al final de la tarde (5:00 PM - 6:30 PM)'
];

export const buildWhatsAppOrderUrl = ({
  cartItemList,
  customerFullName,
  deliveryAddressText = '',
  selectedPaymentMethod = '',
  exchangeRateBcv = 62.50,
  orderNotesText = '',
  fulfillmentType = 'delivery',
  selectedZone = null,
  pickupEstimatedTime = 'En 30 - 45 minutos',
  deliveryCostUsd = 0
}) => {
  const configuredPhoneNumber = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || '584146770016';
  const cleanDestinationNumber = configuredPhoneNumber.replace(/[^\d]/g, '');

  const totalProductsUsd = cartItemList.reduce((accumulatorAmount, currentItem) => {
    return accumulatorAmount + (currentItem.productPriceUsd * currentItem.selectedQuantity);
  }, 0);

  const appliedDeliveryCost = fulfillmentType === 'delivery' ? (selectedZone?.deliveryCostUsd || deliveryCostUsd || 0) : 0;
  const finalTotalUsd = totalProductsUsd + appliedDeliveryCost;
  const finalTotalBcv = finalTotalUsd * exchangeRateBcv;

  const orderLinesText = cartItemList.map((cartEntryItem) => {
    const itemSubtotalUsd = (cartEntryItem.productPriceUsd * cartEntryItem.selectedQuantity).toFixed(2);
    const portionPart = cartEntryItem.portionLabel ? ` (${cartEntryItem.portionLabel})` : '';
    const cutPart = cartEntryItem.selectedCut ? `\n  Corte: ${cartEntryItem.selectedCut}` : '';
    const itemNoteText = cartEntryItem.customItemNote && cartEntryItem.customItemNote.trim()
      ? `\n  Nota: ${cartEntryItem.customItemNote.trim()}`
      : '';
    return `• ${cartEntryItem.selectedQuantity}x ${cartEntryItem.productTitle}${portionPart} - $${itemSubtotalUsd}${cutPart}${itemNoteText}`;
  }).join('\n');

  const customerDetailSection = customerFullName && customerFullName.trim()
    ? `*Cliente:* ${customerFullName.trim()}`
    : '';

  let fulfillmentSection = '';
  if (fulfillmentType === 'pickup') {
    fulfillmentSection = [
      '*Modalidad:* Retiro en Sede (Pick-up)',
      '*Sede:* Av. 10 con Calle 66, Maracaibo',
      `*Hora estimada:* ${pickupEstimatedTime || 'En 30 - 45 minutos'}`
    ].join('\n');
  } else {
    fulfillmentSection = [
      '*Modalidad:* Delivery a Domicilio',
      selectedZone ? `*Zona:* ${selectedZone.zoneName}` : '',
      deliveryAddressText && deliveryAddressText.trim() ? `*Dirección:* ${deliveryAddressText.trim()}` : ''
    ].filter(Boolean).join('\n');
  }

  const paymentDetailSection = selectedPaymentMethod && selectedPaymentMethod.trim()
    ? `*Método de pago:* ${selectedPaymentMethod.trim()}`
    : '';
  const notesDetailSection = orderNotesText && orderNotesText.trim()
    ? `*Instrucciones:* ${orderNotesText.trim()}`
    : '';

  const orderMetadataDetails = [
    customerDetailSection,
    fulfillmentSection,
    paymentDetailSection,
    notesDetailSection
  ].filter(Boolean);

  const breakdownSection = fulfillmentType === 'delivery' && appliedDeliveryCost > 0
    ? [
        `*Subtotal:* $${totalProductsUsd.toFixed(2)}`,
        `*Delivery:* $${appliedDeliveryCost.toFixed(2)}`
      ]
    : [];

  const fullOrderMessage = [
    '*QUESERÍA SAN JOAQUÍN*',
    'Solicitud de Pedido',
    '',
    ...orderMetadataDetails,
    '',
    '*Detalle de Productos:*',
    orderLinesText,
    '',
    ...breakdownSection,
    `*Total USD:* $${finalTotalUsd.toFixed(2)}`,
    `*Total Ref. BCV:* Bs. ${finalTotalBcv.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (Tasa: Bs. ${exchangeRateBcv.toFixed(2)})`
  ].filter(messageLine => messageLine !== null).join('\n');

  return `https://wa.me/${cleanDestinationNumber}?text=${encodeURIComponent(fullOrderMessage)}`;
};
