import React, {useState} from 'react';
import {Alert, Text, View} from 'react-native';
import {TokenBuy} from './components/TokenBuy';
import {TokenSell} from './components/TokenSell';
import {TOKEN_TABS} from './Constants';
import {buySellStyles} from './TokenBuySellStyles';

export const TokenBuySell: React.FC<any> = ({route}) => {
  const tokenType = route?.params?.tokenType;
  // <----- states ---->
  const [activeTab, setActiveTab] = useState<string>(
    tokenType || TOKEN_TABS.BUY,
  );

  const {header, headerText, body, activeText} = buySellStyles;

  //TO HANDLE TABS
  const handleTabs = (type: string) => {
    setActiveTab(type);
  };

  return (
    <>
      <View style={header}>
        <Text
          style={[headerText, activeTab === TOKEN_TABS.BUY && activeText]}
          onPress={() => handleTabs(TOKEN_TABS.BUY)}>
          Buy
        </Text>
        <Text
          style={[headerText, activeTab === TOKEN_TABS.SELL && activeText]}
          onPress={() => handleTabs(TOKEN_TABS.SELL)}>
          Sell
        </Text>
      </View>
      <View style={body}>
        {activeTab == TOKEN_TABS.BUY ? <TokenBuy /> : <TokenSell />}
      </View>
    </>
  );
};
