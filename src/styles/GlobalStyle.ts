import {StyleSheet} from 'react-native';

export const GlobalStyles = StyleSheet.create({
  verticalMiddle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  horizontalCenter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  displayRow: {
    display: 'flex',
    flexDirection: 'row',
  },

  // <------- Spacing / Margin / Padding Style -------->
  spacingVertical_30: {
    marginVertical: 30,
  },
  spacingVertical_20: {
    marginVertical: 20,
  },
  spacingVertical_10: {
    marginVertical: 10,
  },
  spacingVertical_5: {
    marginVertical: 5,
  },
  spacingHorizontal_30: {
    marginHorizontal: 30,
  },
  spacingHorizontal_20: {
    marginHorizontal: 20,
  },
  spacingHorizontal_10: {
    marginHorizontal: 10,
  },

  paddingVertical_10: {
    paddingVertical: 10,
  },
  paddingVertical_20: {
    paddingVertical: 20,
  },
  paddingVertical_30: {
    paddingVertical: 30,
  },
  paddingHorizontal_10: {
    paddingHorizontal: 10,
  },
  paddingHorizontal_20: {
    paddingHorizontal: 20,
  },
  paddingHorizontal_30: {
    paddingHorizontal: 30,
  },
  marginLeftAuto: {
    marginLeft: 'auto',
  },

  //<------- Text allignment -------->
  textAlignCenter: {
    textAlign: 'center',
  },
});
