import {StyleSheet} from 'react-native';

export const PortfolioStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3770ff',
    color: '#ffffff',
    flexDirection: 'column',
    paddingLeft: 20,
  },
  upperSection: {
    marginTop: 50,
  },
  upperSectionLabel: {
    fontSize: 15,
    color: '#aac3ff',
  },
  upperSectionDetails: {
    fontSize: 40,
    color: 'white',
    marginTop: 15,
  },
  midSection: {
    marginTop: 50,
  },
  midSectionLabel: {
    fontSize: 13,
    color: '#aac3ff',
  },
  midSectionDetails: {
    fontSize: 30,
    color: 'white',
    marginTop: 15,
  },
  cardSection: {
    flex: 1,
    marginTop: -50,
  },
});
