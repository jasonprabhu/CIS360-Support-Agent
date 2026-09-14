import KPIGrid from './KPIGrid';
import AIInsights from './AIInsights';
import HybridHealthWidget from './HybridHealthWidget';
import RegionConnectivityWidget from './RegionConnectivityWidget';

const OverviewTab = ({ onDrilldown }: { onDrilldown?: (payload: any) => void }) => {
  return (
    <div className="space-y-6">
      <KPIGrid />
      <AIInsights onDrilldown={onDrilldown} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HybridHealthWidget />
        <RegionConnectivityWidget />
      </div>
    </div>
  );
};

export default OverviewTab;
