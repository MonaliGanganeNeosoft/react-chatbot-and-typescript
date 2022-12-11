export interface SignupProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountNumber: string;
  bank: string;
  contactNumber: string;
}

export interface renderInputBoxProps {
  placeholder: string;
  style: string;
}

export interface fieldsInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  label: string;
}

//singIn screen code
export interface SignInProps {
  email: string;
  password: string;
}

export interface AuthStateProps {
  token: string;
}
