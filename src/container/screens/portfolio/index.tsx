import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {IMAGES} from '../../../assets/images';
import InitialCard from '../../../components/cards/InitialCard';
import {ReducersProps} from '../../../libs/redux/reducers/interfaces';
import {portfolioApi} from './api/PortfolioApi';
import {PorfolioDetailsProps, UserTokenListProps} from './portfolioInterfaces';
import {PortfolioStyles as styles} from './PortfolioStyles';

const Portfolio = () => {
  const dispatch = useDispatch();
  const portfolioDetails: PorfolioDetailsProps = useSelector(
    (state: ReducersProps) => state?.portfolio?.portfolioDetails,
  );

  const {bitCoin} = IMAGES;

  useEffect(() => {
    const handlePortfolioApi = async () => {
      await portfolioApi(dispatch);
    };
    handlePortfolioApi();
  }, []);
  console.log(portfolioDetails);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.upperSection}>
          <Text style={styles.upperSectionLabel}>TOTAL PORTFOLIO VALUE</Text>
          <Text style={styles.upperSectionDetails}>........ZAR</Text>
        </View>
        <View style={styles.midSection}>
          <Text style={styles.midSectionLabel}>YESTERDAY'S PROFIT/LOSS</Text>
          <Text style={styles.midSectionDetails}>........ZAR</Text>
        </View>
      </View>
      <View style={styles.cardSection}>
        {/* {portfolioDetails?.userTokenList?.map(
          (token: UserTokenListProps, key: number) => ( */}
        <View style={{marginTop: 10}}>
          <InitialCard
            source={bitCoin}
            cardTitle={'1NVEST'}
            cardSubtitle={'ETF'}
          />
        </View>
        {/* )} */}
      </View>
    </>
  );
};

export default Portfolio;
