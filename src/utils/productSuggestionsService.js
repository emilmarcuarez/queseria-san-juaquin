import productsCatalogData from '../data/productsCatalogData.json';

const defaultFallbackSuggestions = [
  'Empaque sellado',
  'Bien fresco',
  'Empacar por separado'
];

export const getProductTailoredSuggestions = (targetProduct) => {
  if (!targetProduct) {
    return defaultFallbackSuggestions;
  }

  const foundCatalogProduct = productsCatalogData.find(
    (catalogElement) => catalogElement.productIdentifier === targetProduct.productIdentifier
  );

  const referenceProduct = foundCatalogProduct || targetProduct;
  const productTitleLower = (referenceProduct.productTitle || '').toLowerCase();
  const departmentIdentifier = referenceProduct.departmentIdentifier || '';

  const specificSuggestions = [];

  if (Array.isArray(referenceProduct.availableCutOptions) && referenceProduct.availableCutOptions.length > 0) {
    specificSuggestions.push(...referenceProduct.availableCutOptions);
  }

  if (productTitleLower.includes('diablitos')) {
    return [
      'Lata sellada intacta',
      'Para untar arepas',
      'Fecha reciente',
      'Empacar con cuidado'
    ];
  }

  if (productTitleLower.includes('harina')) {
    return [
      'Empaque sellado',
      'Para arepas suaves',
      'Para empanadas',
      'Proteger de humedad'
    ];
  }

  if (productTitleLower.includes('arroz') || productTitleLower.includes('pasta')) {
    return [
      'Empaque sellado',
      'Grano entero',
      'Empacar separado',
      'Fecha reciente'
    ];
  }

  if (productTitleLower.includes('cafe') || productTitleLower.includes('café')) {
    return [
      'Empaque al vacío intacto',
      'Molido fresco para greca',
      'Aroma sellado',
      'Empacar con cuidado'
    ];
  }

  if (productTitleLower.includes('aceite')) {
    return [
      'Botella sellada',
      'Empacar de pie vertical',
      'Bolsa protectora'
    ];
  }

  if (productTitleLower.includes('mayonesa') || productTitleLower.includes('salsa') || productTitleLower.includes('ketchup')) {
    return [
      'Frasco sellado con precinto',
      'Empacar con cuidado',
      'Fecha de vencimiento lejana'
    ];
  }

  if (productTitleLower.includes('pirulin') || productTitleLower.includes('galleta') || productTitleLower.includes('susy')) {
    return [
      'Empaque crujiente intacto',
      'Proteger de golpes',
      'Fecha reciente'
    ];
  }

  if (productTitleLower.includes('pan de jamon') || productTitleLower.includes('pan de jamón')) {
    return [
      'Recién horneado del día',
      'Pieza entera protegida',
      'Rebanar en bandeja',
      'Bien calientito'
    ];
  }

  if (productTitleLower.includes('pan') && departmentIdentifier === 'panaderia-desayuno') {
    return [
      'Bien fresco y esponjoso',
      'Corteza suave',
      'Proteger de aplastamiento'
    ];
  }

  if (departmentIdentifier === 'quesos-lacteos' || productTitleLower.includes('queso')) {
    if (productTitleLower.includes('mano') || productTitleLower.includes('guayanes') || productTitleLower.includes('telita')) {
      return [
        'Con bastante suero',
        'Fresco del día',
        'Empaque bien sellado',
        'Para cachapas'
      ];
    }

    if (specificSuggestions.length > 0) {
      if (!specificSuggestions.includes('Empacar por separado')) {
        specificSuggestions.push('Empacar por separado');
      }
      return specificSuggestions.slice(0, 4);
    }

    return [
      'Rebanado fino',
      'Rebanado estándar',
      'En trozo entero',
      'Empacar por separado'
    ];
  }

  if (departmentIdentifier === 'jamones-charcuteria') {
    if (productTitleLower.includes('salchicha')) {
      return [
        'Empaque al vacío intacto',
        'Bien refrigerado',
        'Fecha reciente'
      ];
    }

    if (specificSuggestions.length > 0) {
      if (!specificSuggestions.includes('Empacar por separado')) {
        specificSuggestions.push('Empacar por separado');
      }
      return specificSuggestions.slice(0, 4);
    }

    return [
      'Rebanado fino',
      'Rebanado estándar',
      'Para sandwich',
      'Empacar por separado'
    ];
  }

  if (specificSuggestions.length > 0) {
    return specificSuggestions.slice(0, 4);
  }

  return defaultFallbackSuggestions;
};
