import React from 'react';
import {View} from 'react-native';
import Text from '../../../components/text';
import {COLORS} from '../../../styles/Colors';
import {GlobalStyles} from '../../../styles/GlobalStyle';
import {depositInstructions} from './DepositConstants';
import {DepositStyles} from './DepositStyles';

export const Header = () => {
  const {header} = DepositStyles;
  return (
    <View style={[header, GlobalStyles.paddingHorizontal_20]}>
      {depositInstructions.map((instruction: string) => (
        <View style={[GlobalStyles.displayRow, GlobalStyles.spacingVertical_5]}>
          <Text
            label={`${'\u2022'} `}
            color={COLORS.WHITE}
            fontSize="15px"
            fontWeight="bold"
          />
          <Text label={`${instruction}`} color={COLORS.WHITE} fontSize="15px" />
        </View>
      ))}
    </View>
  );
};
