import React from 'react';
import {ScrollView, View} from 'react-native';
import PrimaryButton from '../../../../components/buttons/PrimaryButton';
import Text from '../../../../components/text';
import {COLORS} from '../../../../styles/Colors';
import {GlobalStyles} from '../../../../styles/GlobalStyle';
import {DepositStyles as styles} from '../DepositStyles';
import {Header} from '../Header';

export const DepositDetails = () => {
  const customerInfo = [
    {Text: 'Recipient', Data: 'VALR'},
    {Text: 'Account number', Data: '001624849'},
    {Text: 'Account type', Data: 'Current/Cheque'},
    {Text: 'Bank', Data: 'Standard Banck'},
    {Text: 'Branch', Data: '051001'},
    {Text: 'Reference number', Data: 'VRRRT JBNE'},
  ];
  return (
    <>
      <ScrollView>
        <Header />
        <View style={GlobalStyles.spacingHorizontal_20}>
          <Text
            label={
              'Sign in to your bank and make a deposit with the following information'
            }
            fontSize="20px"
            style={[
              GlobalStyles.textAlignCenter,
              GlobalStyles.spacingVertical_10,
            ]}
          />
          <View style={[GlobalStyles.spacingVertical_30, styles.boxWrapper]}>
            <Text
              label="Make a deposit using refrence"
              color={COLORS.BLUE}
              fontSize="15px"
              style={[GlobalStyles.textAlignCenter]}
            />
            <Text
              label="ONE"
              color={COLORS.BLUE}
              fontSize="20px"
              style={[GlobalStyles.textAlignCenter, {marginTop: 20}]}
            />
          </View>
          <View style={[GlobalStyles.spacingVertical_30]}>
            {customerInfo.map((info: any) => (
              <View
                style={[
                  GlobalStyles.displayRow,
                  GlobalStyles.spacingVertical_10,
                ]}>
                <Text label={info.Text} fontSize="15px"></Text>
                <Text
                  label={info.Data}
                  fontSize="18px"
                  style={{marginLeft: 'auto'}}></Text>
              </View>
            ))}
          </View>
          <PrimaryButton label="CLOSE" callback={() => {}} />
        </View>
      </ScrollView>
    </>
  );
};
