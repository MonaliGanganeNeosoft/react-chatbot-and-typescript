import styled from 'styled-components/native';
import {COLORS} from '../../../styles/Colors';

import {ButtonStyledProps} from '../ButtonInterface';

export const ButtonView: any = styled.TouchableOpacity<ButtonStyledProps>`
  padding: 8px 10px;
  margin:10px;
  border:1px solid ${(props: ButtonStyledProps) =>
    props.borderColor ? props.borderColor : COLORS.BLUE}
  border-radius: 10px;
  flex-direction: row;
  justify-content: center;
  opacity:${(props: ButtonStyledProps) => (props.disabled ? 0.7 : 1)};
  background-color: ${(props: ButtonStyledProps) =>
    props.bgColor ? props.bgColor : COLORS.BLUE};
`;

export const ButtonText: any = styled.Text<ButtonStyledProps>`
  color: ${(props: ButtonStyledProps) => (props.color ? props.color : 'white')};
  font-size: ${(props: ButtonStyledProps) =>
    props.fontSize ? props.fontSize : '15px'};
  font-weight: ${(props: ButtonStyledProps) =>
    props.fontWeight ? props.fontWeight : 'bold'};
`;
