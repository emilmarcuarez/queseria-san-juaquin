const formatExchangeRateDateDisplay = (rawDateString) => {
  if (!rawDateString || typeof rawDateString !== 'string') {
    return '';
  }

  try {
    if (rawDateString.includes('T')) {
      const dateSegment = rawDateString.split('T')[0];
      const dateTokens = dateSegment.split('-');
      if (dateTokens.length === 3) {
        const [yearToken, monthToken, dayToken] = dateTokens;
        return `${dayToken}/${monthToken}/${yearToken}`;
      }
    }

    if (rawDateString.includes('-')) {
      const dateTokens = rawDateString.split('-');
      if (dateTokens.length === 3) {
        const [yearToken, monthToken, dayToken] = dateTokens;
        return `${dayToken}/${monthToken}/${yearToken}`;
      }
    }

    const parsedDateObject = new Date(rawDateString);
    if (!isNaN(parsedDateObject.getTime())) {
      const formattedDay = String(parsedDateObject.getDate()).padStart(2, '0');
      const formattedMonth = String(parsedDateObject.getMonth() + 1).padStart(2, '0');
      const formattedYear = parsedDateObject.getFullYear();
      return `${formattedDay}/${formattedMonth}/${formattedYear}`;
    }
  } catch (dateParsingError) {
    return rawDateString;
  }

  return rawDateString;
};

export const fetchLiveBcvExchangeRate = async () => {
  const defaultFallbackRate = parseFloat(import.meta.env.VITE_BCV_EXCHANGE_RATE || '848.50');

  try {
    const dolarApiResponse = await fetch('https://ve.dolarapi.com/v1/dolares/oficial', {
      headers: {
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined
    });

    if (dolarApiResponse.ok) {
      const responseData = await dolarApiResponse.json();
      const candidateRateNumber = typeof responseData.promedio === 'number'
        ? responseData.promedio
        : parseFloat(responseData.promedio);

      if (!isNaN(candidateRateNumber) && candidateRateNumber > 0) {
        return {
          exchangeRateUsd: candidateRateNumber,
          rateDateString: formatExchangeRateDateDisplay(responseData.fechaActualizacion || ''),
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
      },
      signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined
    });

    if (dolarVzlaResponse.ok) {
      const responseData = await dolarVzlaResponse.json();
      if (responseData && responseData.current && typeof responseData.current.usd === 'number') {
        return {
          exchangeRateUsd: responseData.current.usd,
          rateDateString: formatExchangeRateDateDisplay(responseData.current.date || ''),
          fetchSourceIdentifier: 'dolarvzla-direct'
        };
      }
    }
  } catch (dolarVzlaError) {
  }

  try {
    const proxyCorsResponse = await fetch(
      `https://api.allorigins.win/raw?url=${encodeURIComponent('https://rates.dolarvzla.com/bcv/current.json')}`,
      {
        signal: AbortSignal.timeout ? AbortSignal.timeout(3500) : undefined
      }
    );

    if (proxyCorsResponse.ok) {
      const responseData = await proxyCorsResponse.json();
      if (responseData && responseData.current && typeof responseData.current.usd === 'number') {
        return {
          exchangeRateUsd: responseData.current.usd,
          rateDateString: formatExchangeRateDateDisplay(responseData.current.date || ''),
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
