import styled from 'styled-components/native';
import {ImageStyledProps} from '../ImageInterface';

export const Image: any = styled.Image<ImageStyledProps>`
  position: ${(props: ImageStyledProps) =>
    props.position ? props.position : 'relative'};
  margin: ${(props: ImageStyledProps) => (props.margin ? props.margin : 0)}px;
  width: ${(props: ImageStyledProps) => (props.width ? props.width : 50)}px;
  height: ${(props: ImageStyledProps) => (props.width ? props.width : 50)}px;
`;
