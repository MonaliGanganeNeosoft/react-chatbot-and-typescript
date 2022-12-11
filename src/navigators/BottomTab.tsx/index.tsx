import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import ImageLayout from '../../components/image';
import {tabData} from './TabConstants';
const Tab = createBottomTabNavigator();
export const Footer: React.FC<{}> = () => {
  return (
    <>
      <View style={{flex: 1}}>
        <Tab.Navigator
          initialRouteName={'Portfolio'}
          screenOptions={{headerShown: false}}>
          {tabData.map(tab => (
            <Tab.Screen
              key={tab.label}
              name={tab.label}
              component={tab.component}
              options={{
                tabBarIcon: () => (
                  <ImageLayout source={tab.icon} width={20} height={20} />
                ),
              }}
            />
          ))}
        </Tab.Navigator>
      </View>
    </>
  );
};

const styles = StyleSheet.create({});
