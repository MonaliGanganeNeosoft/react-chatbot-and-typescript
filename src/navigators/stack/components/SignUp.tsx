import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import PrimaryButton from '../../../components/buttons/PrimaryButton';
import {Loader} from '../../../components/loader';
import Text from '../../../components/text';
import {COLORS} from '../../../styles/Colors';
import {ROUTES} from '../../../constants/Routes';
import {GlobalStyles} from '../../../styles/GlobalStyle';
import {signupApi} from '../api/AuthApi';
import {AuthStackStyles} from '../AuthStackStyles';
import {fieldsInput, signupFields} from '../constants';
import {fieldsInputProps, SignupProps} from '../interfaces';

export const SignUp = () => {
  const [fields, setFields] = useState<SignupProps>(signupFields);
  const [isLoading, setLoading] = useState<boolean>(false);

  const navigation: any = useNavigation();
  const {textInput, topSpacing} = AuthStackStyles;
  const {horizontalCenter} = GlobalStyles;
  const handleInputText = (type: string, value: string) => {
    const fieldData: any = fields;
    fieldData[type] = value;
    fieldData['address'] = 'A-101';
    setFields(fieldData);
  };

  const renderInputBox = (
    label: string,
    placeholder: string,
    secureTextEntry: boolean,
    style: string = '',
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

  const handleSuccess = () => {
    setLoading(false);
    navigation.navigate(ROUTES.SIGNIN);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await signupApi(fields, handleSuccess);
  };

  return (
    <>
      <Loader visibility={isLoading} />
      <ScrollView>
        <View>
          <View style={[topSpacing, horizontalCenter]}>
            <Text
              fontSize={'20px'}
              label={'Create an account'}
              color={COLORS.BLUE}></Text>
          </View>
          <View>
            {fieldsInput?.map((feildInput: fieldsInputProps) => {
              const {label, placeholder, secureTextEntry = false} = feildInput;
              return renderInputBox(label, placeholder, secureTextEntry);
            })}
          </View>
          <PrimaryButton label={'Submit'} callback={() => handleSubmit()} />

          <View style={horizontalCenter}>
            <Text label={'Already have an account ?'}></Text>
            <TouchableOpacity
              onPress={handleSuccess}
              style={{paddingLeft: '1%'}}>
              <Text fontWeight={'bold'} label={'Login here'} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};
