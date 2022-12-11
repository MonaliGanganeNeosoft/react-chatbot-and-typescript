import React from 'react';
import {View, Text} from 'react-native';
import ImageLayout from '../../../../components/image';
import {IMAGES} from '../../../../assets/images';
import {styles} from '../TransactionDetailStyle';

export const TransactionDetail = () => {
  let transactionArr: any = [
    {
      title: 'Transfer Id',
      value: '00000',
    },
    {
      title: 'Status',
      value: 'Received',
    },
    {
      title: 'You Transfer',
      value: 'USD 1000.00',
    },
    {
      title: 'Transfer Fee',
      value: 'Free',
    },
    {
      title: 'Total Amount',
      value: '1000.00',
    },
    {
      title: 'Date',
      value: '20.10.03',
    },
    {
      title: 'Time',
      value: '14:35 pm',
    },
  ];
  return (
    <>
      <View style={styles.headerContainer}>
        <View style={[styles.sectionHeadImageWrapper, styles.lineWrapper]}>
          <ImageLayout
            source={IMAGES.withdrawImage}
            width={25}
            position="absolute"
            margin={12}
          />
        </View>
        <View style={styles.lineWrapper}>
          <ImageLayout
            source={IMAGES.lineImage}
            width={25}
            position="absolute"
            margin={12}
          />
        </View>
        <View style={[styles.sectionHeadImageWrapper, styles.lineWrapper]}>
          <ImageLayout
            source={IMAGES.withdrawImage}
            width={25}
            position="absolute"
            margin={12}
          />
        </View>
        <View style={styles.lineWrapper}>
          <ImageLayout
            source={IMAGES.forwardArrowImage}
            width={25}
            position="absolute"
            margin={12}
          />
        </View>
        <View style={[styles.sectionHeadImageWrapper, styles.lineWrapper]}>
          <ImageLayout
            source={IMAGES.withdrawImage}
            width={25}
            position="absolute"
            margin={12}
          />
        </View>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.titleImage}>
          <Text style={styles.mainTitle}>Payment Status</Text>
          <View style={styles.imageLayout}>
            <ImageLayout
              source={IMAGES.menuImage}
              width={25}
              position="absolute"
              margin={12}
            />
          </View>
        </View>
        <View style={styles.borderBlock}>
          <Text style={styles.borderTitle}>Your payment received</Text>
          <Text style={styles.amountText}>USD 1000.00</Text>
        </View>
        <View style={styles.transactionData}>
          {transactionArr.map((info: any) => (
            <>
              <View style={styles.transactionRow}>
                <Text style={styles.titleColor}>{info.title}</Text>
                <Text style={styles.valueColor}>{info.value}</Text>
              </View>
            </>
          ))}
        </View>
      </View>
      <View style={styles.footerContainer}>
        <View style={[styles.sectionTabImageWrapper]}>
          <ImageLayout
            source={IMAGES.withdrawImage}
            width={25}
            position="absolute"
            margin={12}
          />
        </View>
        <View style={[styles.sectionTabImageWrapper]}>
          <ImageLayout
            source={IMAGES.withdrawImage}
            width={25}
            position="absolute"
            margin={12}
          />
        </View>
        <View style={[styles.sectionTabImageWrapper]}>
          <ImageLayout
            source={IMAGES.withdrawImage}
            width={25}
            position="absolute"
            margin={12}
          />
        </View>
      </View>
    </>
  );
};
