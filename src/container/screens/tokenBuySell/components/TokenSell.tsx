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

export const TokenSell = () => {
  const [value, setValue] = useState(0);
  const {bitCoin, southAfricaFlag} = IMAGES;
  const [modalVisible, setModalVisible] = useState(false);
  const [chooseData, setChooseData] = useState();
  const [enteredValue, setEnteredValue] = useState(0);

  const changeModalVisible = (bool: any) => {
    setModalVisible(bool);
  };
  const setData = (data: any) => {
    setChooseData(data);
  };

  const handleTokenValue = (value: number) => {
    setEnteredValue(value);
    setValue(value * 10);
  };

  return (
    <>
      {/* TODO: manage with interation */}
      <InitialCard
        source={bitCoin}
        cardTitle={'1NVEST'}
        cardSubtitle={`ETF`}
        subTitleColor={COLORS.GREY}
        leftCardView={
          <PrimaryButton
            label={'SELL'}
            callback={() => {}}
            bgColor="#ffeaef"
            color="#f1446e"
            borderColor="#ffeaef"
          />
        }
      />

      <View style={styles.bodyDetailsCard}>
        <Text
          label="Available Tokens : 100 1NV"
          style={[
            GlobalStyles.verticalMiddle,
            GlobalStyles.paddingHorizontal_20,
            {marginTop: -50},
          ]}
          fontSize="20px"
          fontWeight="bold"
        />
        <View
          style={[GlobalStyles.displayRow, GlobalStyles.spacingVertical_20]}>
          <TextInput
            placeholder={'Token amount'}
            placeholderTextColor={COLORS.GREY}
            style={{fontSize: 25, width: 90}}
            keyboardType="number-pad"
            onChangeText={(val: string) => {
              handleTokenValue(+val);
            }}
          />
          <Text
            label="1NV"
            style={[
              GlobalStyles.verticalMiddle,
              GlobalStyles.paddingHorizontal_20,
            ]}
            fontSize="25px"
          />
        </View>
        <Text label={`~ ${value} ZAR`} fontSize="20px" color={COLORS.GREY} />
        {enteredValue > 100 && (
          <Text
            label="Your account has only 100 tokens to sell"
            fontSize="18px"
            color={COLORS.RED}
            style={[GlobalStyles.spacingVertical_10]}
          />
        )}
        <View style={[GlobalStyles.spacingVertical_30, styles.boxWrapper]}>
          <Text
            style={[GlobalStyles.spacingVertical_10]}
            fontSize="15px"
            label={`Average price per 1NV = 10 ZAR`}
            fontWeight="bold"
          />
        </View>
      </View>
      <PrimaryButton
        label={BUTTON_LABEL.REVIEW_SELL}
        callback={() => {
          changeModalVisible(true);
        }}
        disabled={!enteredValue || enteredValue > 100}
        color="white"
      />
      <CommonModal
        changeModalVisible={changeModalVisible}
        setdata={setData}
        setDescription="Are you sure you want to proceed with the Sell ?"
        modalVisibility={modalVisible}
      />
    </>
  );
};
