import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../styles/Colors';
import {LoaderProps} from './LoaderInterfaces';

export const Loader: React.FC<LoaderProps> = ({visibility}) => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator
      size="large"
      color={COLORS.BLACK}
      animating={visibility}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    top: 320,
    left: 155,
    zIndex: 11,
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
});
