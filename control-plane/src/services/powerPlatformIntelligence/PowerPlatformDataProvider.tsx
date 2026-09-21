import { createContext, useContext, useState, useEffect } from 'react';
import type { IPowerPlatformDataProvider, PPIntelligenceData } from './types';
import { mockPowerPlatformData } from './MockProvider';

const PowerPlatformContext = createContext<IPowerPlatformDataProvider | undefined>(undefined);

export const PowerPlatformDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMockMode, setIsMockMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<PPIntelligenceData>(mockPowerPlatformData);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setData(mockPowerPlatformData);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [isMockMode]);

  return (
    <PowerPlatformContext.Provider value={{ isMockMode, data, isLoading, refreshData, toggleMockMode: () => setIsMockMode(!isMockMode) }}>
      {children}
    </PowerPlatformContext.Provider>
  );
};

export const usePowerPlatformData = () => {
  const context = useContext(PowerPlatformContext);
  if (!context) throw new Error('usePowerPlatformData must be used within PowerPlatformDataProvider');
  return context;
};
