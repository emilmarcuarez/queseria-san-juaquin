export const fetchLiveBcvExchangeRate = async () => {
  const defaultFallbackRate = parseFloat(import.meta.env.VITE_BCV_EXCHANGE_RATE || '848.50');

  try {
    const dolarApiResponse = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (dolarApiResponse.ok) {
      const responseData = await dolarApiResponse.json();
      const candidateRateNumber = typeof responseData.promedio === 'number'
        ? responseData.promedio
        : parseFloat(responseData.promedio);

      if (!isNaN(candidateRateNumber) && candidateRateNumber > 0) {
        return {
          exchangeRateUsd: candidateRateNumber,
          rateDateString: responseData.fechaActualizacion || '',
          fetchSourceIdentifier: 'dolarapi-oficial'
        };
      }
    }
  } catch (dolarApiError) {
  }

  try {
    const dolarVzlaResponse = await fetch('https://rates.dolarvzla.com/bcv/current.json', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (dolarVzlaResponse.ok) {
      const responseData = await dolarVzlaResponse.json();
      if (responseData && responseData.current && typeof responseData.current.usd === 'number') {
        return {
          exchangeRateUsd: responseData.current.usd,
          rateDateString: responseData.current.date || '',
          fetchSourceIdentifier: 'dolarvzla-direct'
        };
      }
    }
  } catch (dolarVzlaError) {
  }

  try {
    const proxyCorsResponse = await fetch(
      `https://api.allorigins.win/raw?url=${encodeURIComponent('https://rates.dolarvzla.com/bcv/current.json')}`
    );

    if (proxyCorsResponse.ok) {
      const responseData = await proxyCorsResponse.json();
      if (responseData && responseData.current && typeof responseData.current.usd === 'number') {
        return {
          exchangeRateUsd: responseData.current.usd,
          rateDateString: responseData.current.date || '',
          fetchSourceIdentifier: 'allorigins-dolarvzla'
        };
      }
    }
  } catch (allOriginsError) {
  }

  return {
    exchangeRateUsd: defaultFallbackRate,
    rateDateString: '',
    fetchSourceIdentifier: 'env-fallback'
  };
};
