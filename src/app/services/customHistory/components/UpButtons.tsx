
import { Icon } from '@ridi/rsg';
import { Actions } from 'app/services/customHistory';
import * as React from 'react';
import { connect } from 'react-redux';

export const UpButton: React.SFC< & ReturnType<typeof mapDispatchToProps>> = (props) => (
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

const mapDispatchToProps = (dispatch: any) => {
  return {
    goToUpperPath: () => dispatch(Actions.navigateUp()),
  };
};

export const ConnectedUpButton = connect(null, mapDispatchToProps)(UpButton);
