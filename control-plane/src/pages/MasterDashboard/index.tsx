import { WorkplaceIntelligenceProvider, useWorkplaceIntelligence } from '../../services/workplaceIntelligence/WorkplaceIntelligenceProvider';
import Header from './components/Header';
import WorkplacePulseHero from './components/WorkplacePulseHero';
import ServicePulse from './components/ServicePulse';
import WorkplaceSignals from './components/WorkplaceSignals';
import UserFrictionMap from './components/UserFrictionMap';
import AutomationOpportunity from './components/AutomationOpportunity';
import IntelligenceMap from './components/IntelligenceMap';
import AIBriefing from './components/AIBriefing';
import ActionCenter from './components/ActionCenter';

const DashboardContent = () => {
  const { isLoading } = useWorkplaceIntelligence();

  return (
    <div className="p-6 relative h-full flex flex-col animate-fade-in bg-slate-50 min-h-screen">
      {isLoading && (
        <div className="absolute inset-0 bg-slate-50/50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      <Header />
      <WorkplacePulseHero />
      <ServicePulse />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        {/* Left Column (Main Intel) */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <WorkplaceSignals />
          <UserFrictionMap />
          <IntelligenceMap />
        </div>
        
        {/* Right Column (Action / Summary) */}
        <div className="space-y-6 flex flex-col">
          <AIBriefing />
          <ActionCenter />
          <AutomationOpportunity />
        </div>
      </div>
    </div>
  );
};

const MasterDashboard = () => {
  return (
    <WorkplaceIntelligenceProvider>
      <DashboardContent />
    </WorkplaceIntelligenceProvider>
  );
};

export default MasterDashboard;
