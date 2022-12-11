import React from 'react';
import {TextInput} from 'react-native';
import {InputBoxProps} from './InputBoxInterface';
import {InputBoxView} from './styles/InputBoxStylesHelper';

export const InputBox: React.FC<InputBoxProps> = ({
  label,
  style,
  placeholder,
  placeholderTextColor,
  onChangeText = () => null,
  secureTextEntry = false,
}) => {
  return (
    <InputBoxView
      key={label}
      style={style}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      secureTextEntry={secureTextEntry}
      onChangeText={(val: string) => onChangeText(label, val)}
    />
  );
};
