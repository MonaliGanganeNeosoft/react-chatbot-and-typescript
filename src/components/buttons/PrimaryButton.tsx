import React from 'react';
import {View} from 'react-native';
import {ButtonProps} from './ButtonInterface';
import {ButtonText, ButtonView} from './styles/ButtonStylesHelper';

const PrimaryButton: React.FC<ButtonProps> = ({
  label,
  callback,
  bgColor,
  color,
  borderColor,
  style,
  disabled = false,
}) => {
  return (
    <View>
      <ButtonView
        style={[style]}
        bgColor={bgColor}
        borderColor={borderColor}
        color={color}
        disabled={disabled}
        onPress={() => callback()}>
        <ButtonText color={color}>{label}</ButtonText>
      </ButtonView>
    </View>
  );
};

export default PrimaryButton;
