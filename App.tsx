import React, { useState, useEffect, useCallback } from 'react';
import { CurrencyData } from './types';
import Clock from './components/Clock';
import CurrencyCard from './components/CurrencyCard';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [currencyData, setCurrencyData] = useState<CurrencyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        const LATEST_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/gbp.json';
        const YESTERDAY_URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${yesterdayString}/v1/currencies/gbp.json`;

        const [todayRes, yesterdayRes] = await Promise.all([
            fetch(LATEST_URL),
            fetch(YESTERDAY_URL)
        ]);

        if (!todayRes.ok || !yesterdayRes.ok) {
            let errorMsg = 'Failed to fetch currency data.';
            if (!todayRes.ok) errorMsg += ` Latest rates failed with status ${todayRes.status}.`;
            if (!yesterdayRes.ok) errorMsg += ` Historical rates failed with status ${yesterdayRes.status}.`;
            throw new Error(errorMsg);
        }

        const todayData = await todayRes.json();
        const yesterdayData = await yesterdayRes.json();
        
        const currentRate = todayData.gbp?.pkr;
        const prevRate = yesterdayData.gbp?.pkr;

        if (typeof currentRate !== 'number' || typeof prevRate !== 'number') {
            throw new Error('Invalid currency data format received.');
        }
        
        const change = ((currentRate - prevRate) / prevRate) * 100;

        setCurrencyData({
            current: currentRate,
            previous: prevRate,
            change: change
        });
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
        setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchRates();
    const intervalId = setInterval(fetchRates, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 font-sans isolate">
      {/* Aurora Background */}
      <div className="fixed inset-0 -z-10 h-full w-full">
        <div className="absolute left-[-10rem] top-[-5rem] h-[20rem] w-[20rem] sm:h-[30rem] sm:w-[30rem] rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 opacity-20 dark:opacity-20 blur-[100px] animate-move-blob-1"></div>
        <div className="absolute right-[-10rem] bottom-[-5rem] h-[20rem] w-[20rem] sm:h-[30rem] sm:w-[30rem] rounded-full bg-gradient-to-r from-violet-400 to-pink-400 opacity-20 dark:opacity-25 blur-[100px] animate-move-blob-2"></div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <header className="w-full max-w-4xl flex justify-center items-center mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.1)]">
            Global Dashboard
          </h1>
        </header>

        <main className="w-full max-w-4xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Clock city="London" country="United Kingdom" timeZone="Europe/London" countryCode="GB" />
            <Clock city="Islamabad" country="Pakistan" timeZone="Asia/Karachi" countryCode="PK" />
          </div>
          <CurrencyCard rateData={currencyData} isLoading={isLoading} error={error} />
        </main>
        
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400/80 text-sm">
          <p>&copy; 2025 Muhammad Sulaiman. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;