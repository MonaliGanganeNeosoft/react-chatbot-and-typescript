import React from 'react';
import {View} from 'react-native';
import {COLORS} from '../../styles/Colors';
import ImageLayout from '../image';
import Text from '../text';
import {CardProps} from './CardInterface';
import {CardStyles as styles} from './CardStyle';

const InitialCard: React.FC<CardProps> = ({
  source,
  cardTitle,
  cardSubtitle = '',
  leftCardView = false,
  rightCardView = false,
  subTitleColor = COLORS.BLACK,
}) => {
  const {cardLayout, cardHeader} = styles;
  return (
    <View style={cardLayout}>
      {!!leftCardView && <View style={{flex: 0.5}}>{leftCardView}</View>}
      <View style={{flex: 1, flexDirection: 'row', display: 'flex'}}>
        <ImageLayout source={source} />
        <View style={cardHeader}>
          <Text label={cardTitle} fontSize={'18px'} fontWeight="bold" />
          <Text
            label={cardSubtitle}
            fontSize={'15px'}
            fontWeight="bold"
            color={subTitleColor}
          />
        </View>
      </View>
      {!!rightCardView && <View style={{flex: 1}}>{rightCardView}</View>}
    </View>
  );
};

export default InitialCard;
