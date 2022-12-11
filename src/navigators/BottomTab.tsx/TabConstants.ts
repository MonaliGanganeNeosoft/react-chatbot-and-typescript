import {IMAGES} from '../../assets/images';
import Portfolio from '../../container/screens/portfolio';
import {Logout} from '../../container/screens/logout';
import {TokenBuySell} from '../../container/screens/tokenBuySell';
import TokenSend from '../../container/screens/tokenSend';
import Wallet from '../../container/screens/wallet';

const {walletImage, logoutImage, sendImage, buySellImage, portfolioImage} =
  IMAGES;
export const tabData = [
  {
    label: 'Portfolio',
    icon: portfolioImage,
    component: Portfolio,
  },
  {
    label: 'Wallet',
    icon: walletImage,
    component: Wallet,
  },
  {
    label: 'Buy/Sell',
    icon: buySellImage,
    component: TokenBuySell,
  },
  {
    label: 'Send',
    icon: sendImage,
    component: TokenSend,
  },
  {
    label: 'Logout',
    icon: logoutImage,
    component: Logout,
  },
];
