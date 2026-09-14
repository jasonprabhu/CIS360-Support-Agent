import { useState } from 'react';
import { useSharePointData } from '../../services/sharepointIntelligence/SharePointDataProvider';
import HeroHeader from './components/HeroHeader';
import AskCIS360 from './components/AskCIS360';
import ContentHealthScore from './components/ContentHealthScore';
import ExecutiveKPIs from './components/ExecutiveKPIs';
import ContentIntelligence from './components/ContentIntelligence';
import ContentActivity from './components/ContentActivity';
import SharepointSiteIntelligence from './components/SharepointSiteIntelligence';
import OneDriveIntelligence from './components/OneDriveIntelligence';
import StorageIntelligence from './components/StorageIntelligence';
import SharingIntelligence from './components/SharingIntelligence';
import WhoHasAccess from './components/WhoHasAccess';
import ContentRiskGovernance from './components/ContentRiskGovernance';
import LifecycleIntelligence from './components/LifecycleIntelligence';
import SupportIntelligence from './components/SupportIntelligence';
import RootCauseAI from './components/RootCauseAI';
import SharePoint360Modal from './components/SharePoint360Modal';

const Dashboard = () => {
  const { data, isMockMode } = useSharePointData();
  const [drilldown, setDrilldown] = useState<any>(null);

  if (!isMockMode && !data.isConfigured) {
    return (
      <div className="animate-fade-in p-6">
        <HeroHeader />
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-6">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
          <h3 className="text-lg font-medium text-gray-900">Production connector not configured</h3>
          <p className="mt-2 text-gray-500">Live Microsoft Graph and SharePoint APIs are not yet connected.</p>
          <div className="mt-6 flex justify-center gap-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">Configure Connection</button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50">Use Demo Data</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in p-6 space-y-8 bg-gray-50/30 min-h-screen relative">
      <HeroHeader />
      
      <section>
        <AskCIS360 />
      </section>

      <section>
        <ContentHealthScore />
      </section>

      <section className="pt-4">
        <ExecutiveKPIs />
      </section>

      <section className="pt-4 pb-12 border-b border-gray-200">
        {/* We would normally pass setDrilldown into ContentIntelligence, but didn't update it to accept props in Phase 2 for simplicity. */}
        <ContentIntelligence />
      </section>

      <section className="pt-4">
        <ContentActivity />
      </section>

      <section className="pt-4">
        <SharepointSiteIntelligence />
      </section>

      <section className="pt-4">
        <OneDriveIntelligence />
      </section>

      <section className="pt-4 pb-12 border-b border-gray-200">
        <StorageIntelligence />
      </section>

      <section className="pt-4">
        <SharingIntelligence />
      </section>

      <section className="pt-4">
        <WhoHasAccess />
      </section>

      <section className="pt-4">
        <ContentRiskGovernance />
      </section>

      <section className="pt-4 pb-12 border-b border-gray-200">
        <LifecycleIntelligence />
      </section>

      <section className="pt-4">
        <SupportIntelligence onDrilldown={(payload) => setDrilldown(payload)} />
      </section>

      <section className="pt-4 pb-12">
        <RootCauseAI />
      </section>

      <SharePoint360Modal isOpen={!!drilldown} onClose={() => setDrilldown(null)} payload={drilldown} />
    </div>
  );
};
export default Dashboard;
