/* eslint-disable max-lines */
import React from 'react';
import SignInHeader from './signInHeader';
import TopBar from '../topBar';
import routes from '../../constants/routes';

const Header = ({
  isSigninFlow,
  location: { pathname },
}) => pathname !== routes.termsOfUse.path && (
  isSigninFlow ? (
    <SignInHeader
      dark={pathname === routes.splashscreen.path}
      hideNetwork={pathname === routes.hwWallet.path}
      showSettings
    />
  ) : (
    <TopBar />
  )
);

export default Header;
