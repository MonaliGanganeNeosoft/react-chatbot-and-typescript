import React from 'react';
import {useDispatch} from 'react-redux';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import {removeAuthorizationToken} from '../../helper/Authorization';
import {LOGOUT_SUCCESS} from '../../navigators/stack/api/types';

export const Logout = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    await dispatch({type: LOGOUT_SUCCESS, token: null});
    await removeAuthorizationToken();
  };
  return (
    <>
      <PrimaryButton
        label={'Logout'}
        callback={async () => {
          await handleLogout();
        }}
      />
    </>
  );
};
