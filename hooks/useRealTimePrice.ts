import { useState, useEffect } from 'react';

interface PriceData {
  price: number | null;
  priceChange24h: number | null;
  timestamp: string;
}

export const useRealTimePrice = (interval = 30000) => {
  const [priceData, setPriceData] = useState<PriceData>({
    price: null,
    priceChange24h: null,
    timestamp: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/realtime');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPriceData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        setPriceData({
          price: null,
          priceChange24h: null,
          timestamp: ''
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch immediately
    fetchPrice();

    // Then set up interval
    const intervalId = setInterval(fetchPrice, interval);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [interval]);

  return { priceData, isLoading, error };
};