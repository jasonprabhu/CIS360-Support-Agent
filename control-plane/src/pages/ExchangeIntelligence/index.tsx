import { ExchangeDataProvider } from '../../services/exchangeIntelligence/ExchangeDataProvider';
import Dashboard from './Dashboard';

const ExchangeIntelligence = () => {
  return (
    <ExchangeDataProvider>
      <Dashboard />
    </ExchangeDataProvider>
  );
};

export default ExchangeIntelligence;
