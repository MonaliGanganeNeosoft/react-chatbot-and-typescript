import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import {BUTTON_LABEL} from '../../../components/buttons/ButtonConstants';
import PrimaryButton from '../../../components/buttons/PrimaryButton';
import Text from '../../../components/text';
import {COLORS} from '../../../styles/Colors';
import {ROUTES} from '../../../constants/Routes';
import {authorizationToken} from '../../../helper/Authorization';
import {GlobalStyles} from '../../../styles/GlobalStyle';
import {loginApi} from '../api/AuthApi';
import {LOGIN_SUCCESS} from '../api/types';
import {AuthStackStyles} from '../AuthStackStyles';
import {authText, signInFields, signInfieldsInput} from '../constants';
import {fieldsInputProps, SignInProps} from '../interfaces';
import {FONTS} from '../../../styles/Fonts';

export const SignIn = () => {
  // const [value, setValue] = useState(null);
  const [fields, setFields] = useState<SignInProps>({...signInFields});
  const {IconView, IconUsersign, topSpacing, textInput} = AuthStackStyles;
  const {horizontalCenter} = GlobalStyles;
  const navigation: any = useNavigation();
  const dispatch = useDispatch();

  const handleInputText = (type: string, value: string) => {
    const fieldData: any = {...fields};
    fieldData[type] = value;
    setFields(fieldData);
  };

  const renderInputBox = (
    label: string,
    placeholder: string,
    secureTextEntry: boolean,
    // style: string = '',
  ) => {
    return (
      <TextInput
        key={label}
        style={[textInput]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.GREY}
        secureTextEntry={secureTextEntry}
        onChangeText={(val: string) => handleInputText(label, val)}
      />
    );
  };

  const handleSuccess = async () => {
    const token = await authorizationToken();
    if (!!token) {
      dispatch({type: LOGIN_SUCCESS, payload: token});
    } else navigation.navigate(ROUTES.SIGNIN);
  };

  const handleSubmit = async () => {
    await loginApi(fields, handleSuccess);
  };
  return (
    <>
      <ScrollView>
        <View style={topSpacing}>
          <View style={[horizontalCenter, topSpacing]}>
            <Text
              fontWeight={FONTS.fontWeight.bold}
              fontSize={FONTS.fontSize.large}
              label={authText.WELCOME_TEXT}
            />
          </View>
          <View style={topSpacing}>
            <View>
              {signInfieldsInput?.map((signInfieldsInput: fieldsInputProps) => {
                const {
                  label,
                  placeholder,
                  secureTextEntry = false,
                } = signInfieldsInput;
                return renderInputBox(label, placeholder, secureTextEntry);
              })}
            </View>
            <PrimaryButton
              label={BUTTON_LABEL.SUBMIT}
              callback={() => handleSubmit()}
              disabled={!fields.email || !fields.password}
            />
          </View>
        </View>
        <View style={horizontalCenter}>
          <Text
            label={authText.DONT_HAVE_ACCOUNT}
            fontSize={FONTS.fontSize.small}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate(ROUTES.SIGNUP)}
            style={{paddingLeft: '1%'}}>
            <Text
              fontWeight={FONTS.fontWeight.bold}
              label={authText.REGISTER_HERE}
              fontSize={FONTS.fontSize.small}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};
