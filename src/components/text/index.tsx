import React from 'react';
import {TextView} from './styles/TextStylesHelper';
import {TextProps} from './TextInterfaces';

const Text: React.FC<TextProps> = ({
  label,
  color,
  fontSize,
  fontWeight,
  style,
}) => {
  return (
    <TextView
      style={[style]}
      color={color}
      fontSize={fontSize}
      fontWeight={fontWeight}>
      {label}
    </TextView>
  );
};

export default Text;
