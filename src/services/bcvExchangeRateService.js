export const fetchLiveBcvExchangeRate = async () => {
  const defaultFallbackRate = parseFloat(import.meta.env.VITE_BCV_EXCHANGE_RATE || '62.50');

  try {
    const proxyResponse = await fetch('/api/dolarvzla/bcv/current.json', {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (proxyResponse.ok) {
      const responseData = await proxyResponse.json();
      if (responseData && responseData.current && typeof responseData.current.usd === 'number') {
        return {
          exchangeRateUsd: responseData.current.usd,
          rateDateString: responseData.current.date || '',
          fetchSourceIdentifier: 'dolarvzla-proxy'
        };
      }
    }
  } catch (proxyFetchError) {
    try {
      const directResponse = await fetch('https://rates.dolarvzla.com/bcv/current.json', {
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (directResponse.ok) {
        const responseData = await directResponse.json();
        if (responseData && responseData.current && typeof responseData.current.usd === 'number') {
          return {
            exchangeRateUsd: responseData.current.usd,
            rateDateString: responseData.current.date || '',
            fetchSourceIdentifier: 'dolarvzla-direct'
          };
        }
      }
    } catch (directFetchError) {
      return {
        exchangeRateUsd: defaultFallbackRate,
        rateDateString: '',
        fetchSourceIdentifier: 'env-fallback'
      };
    }
  }

  return {
    exchangeRateUsd: defaultFallbackRate,
    rateDateString: '',
    fetchSourceIdentifier: 'env-fallback'
  };
};
