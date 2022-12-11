import {StyleSheet} from 'react-native';
import {COLORS} from '../../../styles/Colors';

export const buySellStyles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: '#3770ff',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 30,
    margin: 30,
    color: '#aac3ff',
  },
  activeText: {
    color: 'white',
  },
  body: {
    flex: 5,
    marginTop: -40,
  },
  bodyDetailsCard: {
    marginTop: 5,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    backgroundColor: 'white',
  },
  boxWrapper: {
    backgroundColor: COLORS.BLUE_GREY,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 30,
  },
});
