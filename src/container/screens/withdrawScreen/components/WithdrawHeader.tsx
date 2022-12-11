import React from 'react';
import {View} from 'react-native';
import {InputBox} from '../../../../components/inputBox';
import Text from '../../../../components/text';
import {COLORS} from '../../../../styles/Colors';
import {GlobalStyles} from '../../../../styles/GlobalStyle';
import {WithdrawStyles as styles} from '../WithdrawStyles';

export const WithdrawHeader: React.FC<{}> = () => {
  return (
    <View style={[styles.header]}>
      <View style={GlobalStyles.displayRow}>
        <Text
          label="Available Funds"
          fontSize="20px"
          color={COLORS.WHITE}
          fontWeight="bold"
        />
        <Text
          label="R 1000"
          style={[GlobalStyles.marginLeftAuto]}
          fontSize="20px"
          color={COLORS.WHITE}
          fontWeight="bold"
        />
      </View>
      <View>
        <InputBox
          label={'withdraw'}
          style={[GlobalStyles.spacingVertical_20]}
          placeholder="Withdrawal Amount"
          placeholderTextColor={COLORS.GREY}
          onChangeText={() => {}}
        />
      </View>
    </View>
  );
};
