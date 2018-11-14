
import * as React from 'react';
import { connect } from 'react-redux';
import { Icon } from '@ridi/rsg';
import { ActionNavigateUp, navigateUp } from '../actions';

export interface UpButtonDispatchProps {
  goToUpperPath: () => ActionNavigateUp;
}

export const UpButton: React.SFC<UpButtonDispatchProps> = (props) => (
  <button
    type="button"
    className="UpButton"
    onClick={props.goToUpperPath}
  >
    <Icon
      name="arrow_13_left"
      className="UpButton_Icon"
    />
    <span className="a11y">뒤로 가기</span>
  </button>
);

const mapDispatchToProps = (dispatch: any): UpButtonDispatchProps => {
  return {
    goToUpperPath: () => dispatch(navigateUp())
  };
};

export const ConnectedUpButton = connect(null, mapDispatchToProps)(UpButton);
