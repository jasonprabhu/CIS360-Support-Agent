import { IdentityDataProvider } from '../../services/identityIntelligence/IdentityDataProvider';
import Dashboard from './Dashboard';

const IdentityIntelligence = () => {
  return (
    <IdentityDataProvider>
      <Dashboard />
    </IdentityDataProvider>
  );
};

export default IdentityIntelligence;
