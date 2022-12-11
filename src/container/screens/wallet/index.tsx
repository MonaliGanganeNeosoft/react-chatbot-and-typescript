import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import InitialCard from '../../../components/cards/InitialCard';
import {ROUTES} from '../../../constants/Routes';
import {WalletStyles as styles} from './WalletStyles';
import {WalletTabs} from './WalletTabs';
const Wallet = () => {
  const navigation: any = useNavigation();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.upperSection}>
          <Text style={styles.upperSectionLabel}>Total Balance</Text>
          <Text style={styles.upperSectionDetails}>2.400,00 ZAR</Text>
        </View>
        <WalletTabs />
      </View>
      <View style={styles.cardSection}>
        <Text style={styles.cardSectionHeader}>Transactions</Text>
        <View style={{marginTop: 10}}>
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.TRANSACTION_DETAIL)}>
            <InitialCard cardTitle={'1NVEST ETF'} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Wallet;
