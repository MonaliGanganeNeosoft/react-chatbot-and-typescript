import {StyleSheet} from 'react-native';
import {COLORS} from '../../../styles/Colors';

export const WalletStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3770ff',
    color: '#ffffff',
  },
  upperSection: {
    marginTop: 80,
    alignItems: 'center',
  },
  upperSectionLabel: {
    fontSize: 20,
    color: '#aac3ff',
  },
  upperSectionDetails: {
    fontSize: 40,
    color: 'white',
    marginTop: 15,
  },
  cardSection: {
    flex: 1,
    marginTop: -70,
  },
  cardSectionHeader: {
    color: 'white',
    paddingLeft: 15,
    fontSize: 18,
  },
  sectionTabsView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  sectionTab: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionTabImageWrapper: {
    backgroundColor: COLORS.SECONDARY_BLUE,
    borderRadius: 50,
    width: 50,
    height: 50,
    position: 'relative',
  },
  sectionTabText: {
    marginTop: 10,
    color: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
});
