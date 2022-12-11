import {StyleSheet} from 'react-native';
import {COLORS} from '../../styles/Colors';

export const AuthStackStyles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderRadius: 7,
    margin: 15,
    backgroundColor: '#FFFFFF',
    borderColor: '#D9D9D9',
    textAlignVertical: 'top',
    padding: 10,
    fontSize: 20,
    color: COLORS.BLACK,
  },
  middleSpacing: {
    marginTop: 250,
  },
  topSpacing: {
    marginTop: 50,
  },

  // Css For Initial Login Screen Start
  logo: {
    backgroundColor: '#0a2247',
    width: '90%',
    height: '18%',
    marginTop: '40%',
    marginLeft: '5%',
  },
  LogoImage: {
    width: '91%',
    height: '70%',
    marginTop: '4%',
    marginLeft: '3%',
  },
  nextView1: {
    marginTop: '50%',
  },
  textSignIN: {
    textAlign: 'center',
    marginTop: '2%',
    fontSize: 16,
    color: 'white',
  },

  // Css for Initail Login End

  // CSS For SignIn Page Start
  IconView: {
    marginTop: '10%',
    marginLeft: '42%',
    backgroundColor: 'lightgray',
    width: 70,
    height: 70,
    borderRadius: 70 / 2,
  },
  IconUsersign: {
    marginTop: '20%',
    marginLeft: '28%',
  },

  textUserName: {
    marginTop: '20%',
    fontSize: 17,
    marginLeft: '5%',
    color: COLORS.BLACK,
  },
  textPassword: {
    marginTop: '22%',
    fontSize: 17,
    marginLeft: '5%',
    color: COLORS.BLACK,
  },
  textPassview: {
    marginTop: '-20%',
  },

  textNext: {
    textAlign: 'center',
    marginTop: '3%',
    fontSize: 16,
    color: 'white',
  },

  //CSS For SignIN Page END

  // CSS for SignUp Page Screen

  nextView: {
    backgroundColor: COLORS.BLUE,
    width: '90%',
    height: 50,
    borderRadius: 50 / 2,
    marginTop: '5%',
    marginLeft: '4%',
  },
});
