export interface InputBoxProps {
  label?: string;
  style: any;
  placeholder: string;
  placeholderTextColor: string;
  onChangeText?: Function;
  secureTextEntry?: boolean;
}

export interface InputBoxStyledProps {
  padding: number;
  margin: number;
  fontSize: number;
}
