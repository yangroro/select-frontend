import * as React from 'react';

import { Icon } from '@ridi/rsg';

import history from 'app/config/history';
import { PrimaryRoutes } from 'app/routes';
import { RidiSelectState } from 'app/store';
import { connect } from 'react-redux';

interface CompactGNBProps {
  currentTitle: string;
}

export const CompactGNB: React.SFC<CompactGNBProps> = (props) => (
  <div className="CompactGNBWrapper">
    <div className="CompactGNBContentWrapper">
      <div className="CompactGNB_Left">
        {PrimaryRoutes.includes(`/${location.pathname.split('/')[1]}`) ? (
          <button
            className="CompactGNB_BackButton"
            onClick={() => history.push('/home')}
          >
            <Icon
              name="arrow_5_left"
              className="CompactGNB_BackButton_Icon"
            />
            홈
          </button>
        ) : (
          <button
            className="CompactGNB_BackButton"
            onClick={() => history.goBack()}
          >
            <Icon
              name="arrow_5_left"
              className="CompactGNB_BackButton_Icon"
            />
            뒤로
          </button>
        )}
      </div>
      <div className="CompactGNB_Center">
        <h1 className="CompactGNB_Title">{props.currentTitle}</h1>
      </div>
      <div className="CompactGNB_Right" />
    </div>
  </div>
);

const mapStateToProps = (rootState: RidiSelectState) => ({
  currentTitle: rootState.commonUI.currentTitle,
});

export const ConnectedCompactGNB = connect(mapStateToProps)(CompactGNB);
