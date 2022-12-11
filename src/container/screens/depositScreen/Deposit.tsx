import React, {useState} from 'react';
import {View} from 'react-native';
import {InputBox} from '../../../components/inputBox';
import {CommonModal} from '../../../components/modal/CommonModal';
import {COLORS} from '../../../styles/Colors';
import {GlobalStyles} from '../../../styles/GlobalStyle';
import {depositInputs} from './DepositConstants';
import {Header} from './Header';

export const Deposit = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [chooseData, setChooseData] = useState();

  const changeModalVisible = (bool: any) => {
    setModalVisible(bool);
  };
  const setData = (data: any) => {
    setChooseData(data);
  };
  const renderInputBox = (
    label: string,
    placeholder: string,
    index: number,
  ) => {
    return (
      <InputBox
        key={index}
        style={[
          GlobalStyles.spacingVertical_20,
          GlobalStyles.spacingHorizontal_20,
        ]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.GREY}
      />
    );
  };

  return (
    <>
      <Header />
      <View>
        {depositInputs?.map((withdrawInput: any, index: number) => {
          const {placeholder, label} = withdrawInput;
          return renderInputBox(label, placeholder, index);
        })}
      </View>

      <CommonModal
        changeModalVisible={changeModalVisible}
        setdata={setData}
        setDescription="Are you sure you want to deposit fund"
        modalVisibility={modalVisible}
      />
    </>
  );
};
