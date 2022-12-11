import styled from 'styled-components/native';
import {COLORS} from '../../../styles/Colors';
import {TextStyledProps} from '../TextInterfaces';

export const TextView: any = styled.Text<TextStyledProps>`
  color: ${(props: TextStyledProps) =>
    props.color ? props.color : COLORS.BLACK};
  font-size: ${(props: TextStyledProps) =>
    props.fontSize ? props.fontSize : '12px'};
  font-weight: ${(props: TextStyledProps) =>
    props.fontWeight ? props.fontWeight : 'normal'};
`;
