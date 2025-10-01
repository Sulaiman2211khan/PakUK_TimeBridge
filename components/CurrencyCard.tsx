import React from 'react';
import { CurrencyData } from '../types';

interface CurrencyCardProps {
  rateData: CurrencyData | null;
  isLoading: boolean;
  error: string | null;
}

const ChangeIndicator: React.FC<{ change: number }> = ({ change }) => {
  const isPositive = change >= 0;
  const colorClass = isPositive ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';
  const Arrow = isPositive ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <span className={`font-semibold ${colorClass} flex items-center`}>
      {Arrow}
      {change.toFixed(2)}%
    </span>
  );
};

const CurrencyCard: React.FC<CurrencyCardProps> = ({ rateData, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-gray-400/30 dark:bg-gray-600/30 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-400/30 dark:bg-gray-600/30 rounded w-32"></div>
        </div>
      );
    }

    if (error) {
      return <div className="text-red-500 text-center font-medium">Error: {error}</div>;
    }

    if (rateData) {
      return (
        <div className="text-center">
          <div className="text-4xl sm:text-5xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight [text-shadow:0_2px_4px_rgba(91,104,119,0.2)]">
            {rateData.current.toFixed(2)}
            <span className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-400 ml-2">PKR</span>
          </div>
          <div className="mt-3 flex items-center justify-center space-x-2 text-gray-700 dark:text-gray-300">
            <span>24h Change:</span>
            <ChangeIndicator change={rateData.change} />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="group relative p-6 rounded-2xl bg-white/30 dark:bg-gray-900/40 backdrop-blur-lg border border-white/20 shadow-2xl shadow-gray-600/10 dark:shadow-black/20 transition-all duration-300 hover:border-white/30">
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
        GBP to PKR Exchange Rate
      </h2>
      {renderContent()}
    </div>
  );
};

export default CurrencyCard;