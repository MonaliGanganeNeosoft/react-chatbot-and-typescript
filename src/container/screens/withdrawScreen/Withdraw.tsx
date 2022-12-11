import React, {useState} from 'react';
import {View, Modal} from 'react-native';
import PrimaryButton from '../../../components/buttons/PrimaryButton';
import {CommonModal} from '../../../components/modal/CommonModal';
import {InputBox} from '../../../components/inputBox';
import {COLORS} from '../../../styles/Colors';
import {GlobalStyles} from '../../../styles/GlobalStyle';
import {WithdrawHeader} from './components/WithdrawHeader';
import {withdrawInputs} from './WithdrawConstants';

export const Withdraw = () => {
  const handleInputText = (label: string, val: string) => {};
  const [modalVisible, setModalVisible] = useState(false);
  const [chooseData, setChooseData] = useState();

  const changeModalVisible = (bool: any) => {
    setModalVisible(bool);
  };
  const setData = (data: any) => {
    setChooseData(data);
  };
  const renderInputBox = (label: string, placeholder: string) => {
    return (
      <InputBox
        key={label}
        style={[
          GlobalStyles.spacingVertical_20,
          GlobalStyles.spacingHorizontal_20,
        ]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.GREY}
        onChangeText={(val: string) => handleInputText(label, val)}
      />
    );
  };
  return (
    <View>
      <WithdrawHeader />
      <View style={[GlobalStyles.spacingVertical_20]}>
        {withdrawInputs?.map((withdrawInput: any) => {
          const {placeholder, label} = withdrawInput;
          return renderInputBox(label, placeholder);
        })}
      </View>
      <PrimaryButton
        label={'Withdraw funds'}
        callback={() => {
          changeModalVisible(true);
        }}
      />
      <CommonModal
        changeModalVisible={changeModalVisible}
        setdata={setData}
        setDescription="Are you sure you want to withdraw fund"
        modalVisibility={modalVisible}
      />
    </View>
  );
};
