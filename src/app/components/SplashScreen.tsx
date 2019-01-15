import * as React from 'react';

import { Icon } from "@ridi/rsg";

interface Props {
  isRidiApp: boolean;
  isFetching: boolean;
  isSubscribing: boolean;
}

const WithLogo: React.SFC = () => (
  <div className="SplashScreen">
    <Icon
      name="logo_ridiselect_1"
      className="SplashScreen_Logo"
    />
  </div>
);

const WhiteScreen: React.SFC = () => (
  <div className="SplashScreen .SplashScreen-whiteScreen" />
);

export const SplashScreen: React.SFC<Props> = (props) => {
  if (props.isRidiApp) {
    if (props.isFetching || !props.isSubscribing) {
      return <WithLogo />;
    }
  } else {
    if (props.isFetching) {
      return <WhiteScreen />;
    } else if (!props.isSubscribing) {
      return <WithLogo />;
    }
  }
  return null;
};

