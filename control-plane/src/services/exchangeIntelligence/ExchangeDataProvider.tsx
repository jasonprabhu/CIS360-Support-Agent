import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { IExchangeDataProvider } from './types';
import { MockExchangeDataProvider } from './MockProvider';
import { ProductionExchangeDataProvider } from './ProductionProvider';

interface ExchangeContextType {
  data: IExchangeDataProvider;
  isMockMode: boolean;
  setMockMode: (mock: boolean) => void;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined);

export const ExchangeDataProvider = ({ children }: { children: ReactNode }) => {
  const [isMockMode, setMockMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IExchangeDataProvider>(new MockExchangeDataProvider());

  useEffect(() => {
    const provider = isMockMode ? new MockExchangeDataProvider() : new ProductionExchangeDataProvider();
    setData(provider);
  }, [isMockMode]);

  const refresh = async () => {
    setIsLoading(true);
    await data.refreshData();
    setIsLoading(false);
  };

  return (
    <ExchangeContext.Provider value={{ data, isMockMode, setMockMode, isLoading, refresh }}>
      {children}
    </ExchangeContext.Provider>
  );
};

export const useExchangeData = () => {
  const context = useContext(ExchangeContext);
  if (context === undefined) {
    throw new Error('useExchangeData must be used within an ExchangeDataProvider');
  }
  return context;
};
