export interface TextStyledProps {
  color?: string;
  fontSize?: string;
  fontWeight?: string;
}
export interface TextProps extends TextStyledProps {
  label: string;
  style?: any;
}
