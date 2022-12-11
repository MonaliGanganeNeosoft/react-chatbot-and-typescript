import React, {useState} from 'react';
import {Modal, TextInput, View} from 'react-native';
import {IMAGES} from '../../../../assets/images';
import {BUTTON_LABEL} from '../../../../components/buttons/ButtonConstants';
import PrimaryButton from '../../../../components/buttons/PrimaryButton';
import InitialCard from '../../../../components/cards/InitialCard';
import {CommonModal} from '../../../../components/modal/CommonModal';
import Text from '../../../../components/text';
import {COLORS} from '../../../../styles/Colors';
import {GlobalStyles} from '../../../../styles/GlobalStyle';
import {buySellStyles as styles} from '../TokenBuySellStyles';

export const TokenBuy = () => {
  const {bitCoin, southAfricaFlag} = IMAGES;
  const [value, setValue] = useState(0);
  const [enteredValue, setEnteredValue] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  // FIXME: change afterwards

  const [chooseData, setChooseData] = useState();

  const changeModalVisible = (bool: any) => {
    setModalVisible(bool);
  };
  const setData = (data: any) => {
    setChooseData(data);
  };

  const handleTokenValue = (value: number) => {
    setEnteredValue(value);
    setValue(value / 10);
  };

  return (
    <>
      <InitialCard
        source={bitCoin}
        cardTitle={'1NVEST'}
        cardSubtitle={'ETF'}
        subTitleColor={COLORS.GREY}
        leftCardView={
          <PrimaryButton
            label={'BUY'}
            callback={() => {}}
            bgColor="#e6fcf9"
            color="#19dcc5"
            borderColor="#e6fcf9"
          />
        }
      />

      <View style={styles.bodyDetailsCard}>
        <Text
          label="Available Funds : 1000 Rand"
          style={[
            GlobalStyles.verticalMiddle,
            GlobalStyles.paddingHorizontal_20,
            {marginTop: -50},
          ]}
          fontSize="20px"
          fontWeight="bold"
        />
        <View
          style={[GlobalStyles.displayRow, GlobalStyles.spacingVertical_30]}>
          <TextInput
            placeholder={'Token amount'}
            placeholderTextColor={COLORS.GREY}
            style={{fontSize: 25}}
            keyboardType="number-pad"
            onChangeText={(val: string) => handleTokenValue(+val)}
          />
          <Text
            label="ZAR"
            style={[
              GlobalStyles.verticalMiddle,
              GlobalStyles.paddingHorizontal_20,
            ]}
            fontSize="25px"
          />
        </View>
        <Text label={`~ ${value} 1NV`} fontSize="20px" color={COLORS.GREY} />
        {enteredValue > 1000 && (
          <Text
            label="Insufficient balance"
            fontSize="18px"
            color={COLORS.RED}
            style={[GlobalStyles.spacingVertical_10]}
          />
        )}

        <View style={[GlobalStyles.spacingVertical_30, styles.boxWrapper]}>
          <Text
            style={[GlobalStyles.spacingVertical_10]}
            fontSize="15px"
            label={`Average price per 1 ZAR = 0.1 1NV`}
            fontWeight="bold"
          />
        </View>
      </View>
      <PrimaryButton
        label={BUTTON_LABEL.REVIEW_BUY}
        callback={() => {
          changeModalVisible(true);
        }}
        disabled={!enteredValue || enteredValue > 1000}
        color={COLORS.WHITE}
      />
      <CommonModal
        changeModalVisible={changeModalVisible}
        setdata={setData}
        setDescription="Are you sure you want to proceed with the Buy ?"
        modalVisibility={modalVisible}
      />
    </>
  );
};
