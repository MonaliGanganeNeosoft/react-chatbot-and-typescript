import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {SafeAreaView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {ROUTES} from '../constants/Routes';
import {DepositDetails} from '../container/screens/depositScreen/components/DepositDetails';
import {Deposit} from '../container/screens/depositScreen/Deposit';
import {TokenBuySell} from '../container/screens/tokenBuySell';
import {TransactionDetail} from '../container/screens/Transaction/components/TransactionDetail';
import {Withdraw} from '../container/screens/withdrawScreen/Withdraw';
import {authorizationToken} from '../helper/Authorization';
import {ReducersProps} from '../libs/redux/reducers/interfaces';
import {Footer} from './BottomTab.tsx';
import {LOGIN_SUCCESS} from './stack/api/types';
import {AuthStack} from './stack/AuthStack';
import {SignIn} from './stack/components/SignIn';
import {SignUp} from './stack/components/SignUp';

export const RootNavigation: React.FC<{}> = () => {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  const dispatch = useDispatch();
  const token: string = useSelector(
    (state: ReducersProps) => state?.auth?.token,
  );

  // // TO HANDLE JWT ON PAGE LOAD
  useEffect(() => {
    async function manageToken() {
      const cookieToken = await authorizationToken();
      const tokenValue: string = token || cookieToken;
      dispatch({type: LOGIN_SUCCESS, payload: tokenValue});
    }
    manageToken();
  }, []);

  return (
    <>
      <SafeAreaView
        style={[
          {
            flex: 1,
            backgroundColor: 'white',
            paddingTop: 0,
          },
        ]}>
        {/* ROUTES */}
        <NavigationContainer>
          {token ? (
            <Stack.Navigator initialRouteName={ROUTES.FOOTER}>
              <Stack.Screen
                name={ROUTES.FOOTER}
                component={Footer}
                options={{headerShown: false}}
              />
              <Stack.Screen name={ROUTES.WITHDRAW} component={Withdraw} />
              <Stack.Screen name={ROUTES.DEPOSIT} component={Deposit} />
              <Stack.Screen
                name={ROUTES.DEPOSIT_DETAILS}
                component={DepositDetails}
              />
              {/* <Stack.Screen
                name={ROUTES.TRANSACTION_DETAIL}
                component={Transactions}
              /> */}
              <Stack.Screen
                name={ROUTES.TOKEN_BUY_SELL}
                component={TokenBuySell}
              />
              <Stack.Screen
                name={ROUTES.TRANSACTION_DETAIL}
                component={TransactionDetail}
              />
            </Stack.Navigator>
          ) : (
            <Stack.Navigator
              initialRouteName={'AUTH_SCREEN'}
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name={ROUTES.SIGNIN} component={SignIn} />
              <Stack.Screen name={ROUTES.SIGNUP} component={SignUp} />
              <Stack.Screen name={ROUTES.AUTH_SCREEN} component={AuthStack} />
            </Stack.Navigator>
          )}
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};
