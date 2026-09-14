import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { IIdentityDataProvider } from './types';
import { MockIdentityDataProvider } from './MockProvider';
import { ProductionIdentityDataProvider } from './ProductionProvider';

interface IdentityContextType {
  data: IIdentityDataProvider;
  isMockMode: boolean;
  setMockMode: (mock: boolean) => void;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const IdentityContext = createContext<IdentityContextType | undefined>(undefined);

export const IdentityDataProvider = ({ children }: { children: ReactNode }) => {
  const [isMockMode, setMockMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IIdentityDataProvider>(new MockIdentityDataProvider());

  useEffect(() => {
    const provider = isMockMode ? new MockIdentityDataProvider() : new ProductionIdentityDataProvider();
    setData(provider);
  }, [isMockMode]);

  const refresh = async () => {
    setIsLoading(true);
    await data.refreshData();
    setIsLoading(false);
  };

  return (
    <IdentityContext.Provider value={{ data, isMockMode, setMockMode, isLoading, refresh }}>
      {children}
    </IdentityContext.Provider>
  );
};

export const useIdentityData = () => {
  const context = useContext(IdentityContext);
  if (context === undefined) {
    throw new Error('useIdentityData must be used within an IdentityDataProvider');
  }
  return context;
};
