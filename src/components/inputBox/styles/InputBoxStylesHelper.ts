import styled from 'styled-components/native';
import {COLORS} from '../../../styles/Colors';
import {InputBoxStyledProps} from '../InputBoxInterface';

export const InputBoxView: any = styled.TextInput<InputBoxStyledProps>`
  border-width: 1px;
  border-radius: 10px;
  background-color: ${COLORS.WHITE};
  padding: ${(props: InputBoxStyledProps) =>
    `${props.padding ? props.padding : 10}px`};
  font-size: ${(props: InputBoxStyledProps) =>
    props.fontSize ? props.fontSize : 20}px;
`;
