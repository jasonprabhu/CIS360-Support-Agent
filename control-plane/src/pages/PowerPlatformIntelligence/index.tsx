import { PowerPlatformDataProvider } from '../../services/powerPlatformIntelligence/PowerPlatformDataProvider';
import Dashboard from './Dashboard';

const PowerPlatformIntelligence = () => {
  return (
    <PowerPlatformDataProvider>
      <Dashboard />
    </PowerPlatformDataProvider>
  );
};

export default PowerPlatformIntelligence;
