import {PorfolioStateProps} from '../../../container/screens/portfolio/portfolioInterfaces';
import {AuthStateProps} from '../../../navigators/stack/interfaces';

export interface ReducersProps {
  auth: AuthStateProps;
  portfolio: PorfolioStateProps;
}
