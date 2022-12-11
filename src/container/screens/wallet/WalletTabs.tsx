import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {IMAGES} from '../../../assets/images';
import ImageLayout from '../../../components/image';
import {ROUTES} from '../../../constants/Routes';
import {TOKEN_TABS} from '../tokenBuySell/Constants';
import {WalletStyles} from './WalletStyles';

export const WalletTabs: React.FC<{}> = () => {
  const navigation: any = useNavigation();
  const {sectionTabsView, sectionTab, sectionTabText, sectionTabImageWrapper} =
    WalletStyles;
  return (
    <View style={sectionTabsView}>
      <TouchableOpacity
        style={sectionTab}
        onPress={() =>
          navigation.navigate(ROUTES.TOKEN_BUY_SELL, {
            tokenType: TOKEN_TABS.BUY,
          })
        }>
        <View style={sectionTabImageWrapper}>
          <ImageLayout
            source={IMAGES.upArrowImage}
            width={25}
            position="absolute"
            margin={12}
          />
        </View>
        <Text style={sectionTabText}>Buy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={sectionTab}
        onPress={() =>
          navigation.navigate(ROUTES.TOKEN_BUY_SELL, {
            tokenType: TOKEN_TABS.SELL,
          })
        }>
        <View style={sectionTabImageWrapper}>
          <ImageLayout
            source={IMAGES.downArrowImage}
            width={25}
            position="absolute"
            margin={12}
          />
        </View>
        <Text style={sectionTabText}>Sell</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={sectionTab}
        onPress={() => navigation.navigate(ROUTES.DEPOSIT)}>
        <View style={sectionTabImageWrapper}>
          <ImageLayout
            source={IMAGES.depositImage}
            width={25}
            position="absolute"
            margin={12}
          />
        </View>
        <Text style={sectionTabText}>Deposit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={sectionTab}
        onPress={() => navigation.navigate(ROUTES.WITHDRAW)}>
        <View style={sectionTabImageWrapper}>
          <ImageLayout
            source={IMAGES.withdrawImage}
            width={25}
            position="absolute"
            margin={12}
          />
        </View>
        <Text style={sectionTabText}>Withdraw</Text>
      </TouchableOpacity>
    </View>
  );
};
