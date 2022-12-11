export interface ButtonProps extends ButtonStyledProps {
  label: string;
  callback: Function;
  style?: any;
}

export interface ButtonStyledProps {
  bgColor?: string;
  color?: string;
  borderColor?: string;
  fontSize?: number;
  fontWeight?: string;
  disabled?: boolean;
}
