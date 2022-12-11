import {View} from 'react-native';
import React from 'react';
import Text from '../../../components/text';
import {GlobalStyles} from '../../../styles/GlobalStyle';

export const Transactions = () => {
  return (
    <View>
      <Text
        label="Transaction Screen"
        fontSize="20"
        style={[GlobalStyles.textAlignCenter, GlobalStyles.spacingVertical_30]}
      />
    </View>
  );
};
