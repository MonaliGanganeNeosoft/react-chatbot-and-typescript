import {StyleSheet} from 'react-native';

export const CardStyles = StyleSheet.create({
  cardLayout: {
    margin: 10,
    backgroundColor: '#ffffff',
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  cardHeaderTitle: {
    fontWeight: 'bold',
  },
  cardSubTitle: {
    fontSize: 12,
  },
});
