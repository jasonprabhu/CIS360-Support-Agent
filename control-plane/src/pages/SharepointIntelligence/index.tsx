import { SharePointOneDriveIntelligenceProvider } from '../../services/sharepointIntelligence/SharePointDataProvider';
import Dashboard from './Dashboard';

const SharePointIntelligence = () => {
  return (
    <SharePointOneDriveIntelligenceProvider>
      <Dashboard />
    </SharePointOneDriveIntelligenceProvider>
  );
};
export default SharePointIntelligence;
