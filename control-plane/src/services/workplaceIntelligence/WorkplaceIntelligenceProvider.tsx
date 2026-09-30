import { createContext, useContext, useState, useEffect } from 'react';
import type { IWorkplaceIntelligenceProvider, MasterIntelligenceData, IntelligenceScenario } from './types';
import { mockWorkplaceData } from './MockProvider';

const WorkplaceIntelligenceContext = createContext<IWorkplaceIntelligenceProvider | undefined>(undefined);

export const WorkplaceIntelligenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMockMode, setIsMockMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('Executive');
  const [data, setData] = useState<MasterIntelligenceData>(mockWorkplaceData);
  const [selectedScenario, setSelectedScenario] = useState<IntelligenceScenario | null>(null);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [remediationStatus, setRemediationStatus] = useState<'idle' | 'executing' | 'success'>('idle');

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setData(mockWorkplaceData);
    setIsLoading(false);
  };

  const executeRemediation = async (_scenarioId: string) => {
    setRemediationStatus('executing');
    await new Promise(resolve => setTimeout(resolve, 1800));
    setRemediationStatus('success');
  };

  const resetRemediation = () => {
    setRemediationStatus('idle');
  };

  useEffect(() => {
    refreshData();
  }, [isMockMode]);

  return (
    <WorkplaceIntelligenceContext.Provider value={{
      isMockMode,
      data,
      isLoading,
      role,
      setRole,
      refreshData,
      toggleMockMode: () => setIsMockMode(!isMockMode),
      selectedScenario,
      setSelectedScenario,
      isDeepDiveOpen,
      setIsDeepDiveOpen,
      remediationStatus,
      executeRemediation,
      resetRemediation
    }}>
      {children}
    </WorkplaceIntelligenceContext.Provider>
  );
};

export const useWorkplaceIntelligence = () => {
  const context = useContext(WorkplaceIntelligenceContext);
  if (!context) throw new Error('useWorkplaceIntelligence must be used within WorkplaceIntelligenceProvider');
  return context;
};
