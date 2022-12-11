import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {AuthStackStyles} from './AuthStackStyles';
import {IMAGES} from '../../assets/images/index';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../constants/Routes';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import {COLORS} from '../../styles/Colors';

export const AuthStack: React.FC<{}> = () => {
  const {logo, LogoImage, middleSpacing} = AuthStackStyles;
  const {logoImage} = IMAGES;
  const navigation: any = useNavigation();

  return (
    <>
      <View>
        <View style={logo}>
          <Image style={LogoImage} source={logoImage} />
        </View>
        <View style={middleSpacing}>
          <TouchableOpacity>
            <PrimaryButton
              label={'Create account'}
              callback={() => navigation.navigate(ROUTES.SIGNUP)}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity>
            <PrimaryButton
              label={'Sign in to continue'}
              callback={() => navigation.navigate(ROUTES.SIGNIN)}
              bgColor={COLORS.WHITE}
              color={COLORS.BLACK}
              borderColor={COLORS.WHITE}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
