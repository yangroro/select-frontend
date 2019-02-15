import * as React from 'react';
import { connect } from 'react-redux';

import { RidiSelectState } from 'app/store';

interface EnvBadgeState {
  isProduction: boolean;
}

declare global {
  interface Window {
    __RIDISELECT_STAGING__?: boolean;
    __RIDISELECT_USE_PRODUCTION__?: () => void;
  }
}

const useProduction = window.__RIDISELECT_USE_PRODUCTION__ || (() => {});

export const EnvBadge: React.SFC<EnvBadgeState> = (props) => {
  if (!props.isProduction) {
    return <p className="DEV_environment_ribbon">DEV</p>;
  } else if (window.__RIDISELECT_STAGING__) {
    return (
      <p
        className="STAGING_environment_ribbon"
        onClick={useProduction}
      >
        STAGING
      </p>
    );
  }
  return null;
};

const mapStateToProps = (rootState: RidiSelectState) => ({
  isProduction: rootState.environment.production,
});

export const ConnectedEnvBadge = connect(mapStateToProps)(EnvBadge);
