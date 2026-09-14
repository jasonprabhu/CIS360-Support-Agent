import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ISharePointDataProvider } from './types';
import { MockSharePointDataProvider } from './MockProvider';
import { ProductionSharePointDataProvider } from './ProductionProvider';

interface SPContextType {
  data: ISharePointDataProvider;
  isMockMode: boolean;
  setMockMode: (mock: boolean) => void;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const SharePointContext = createContext<SPContextType | undefined>(undefined);

export const SharePointOneDriveIntelligenceProvider = ({ children }: { children: ReactNode }) => {
  const [isMockMode, setMockMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ISharePointDataProvider>(new MockSharePointDataProvider());

  useEffect(() => {
    const provider = isMockMode ? new MockSharePointDataProvider() : new ProductionSharePointDataProvider();
    setData(provider);
  }, [isMockMode]);

  const refresh = async () => {
    setIsLoading(true);
    await data.refreshData();
    setIsLoading(false);
  };

  return (
    <SharePointContext.Provider value={{ data, isMockMode, setMockMode, isLoading, refresh }}>
      {children}
    </SharePointContext.Provider>
  );
};

export const useSharePointData = () => {
  const context = useContext(SharePointContext);
  if (context === undefined) {
    throw new Error('useSharePointData must be used within a SharePointOneDriveIntelligenceProvider');
  }
  return context;
};
