import { EnvironmentState } from 'app/services/environment';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

interface BigBannerItemStateProps {
  env: EnvironmentState;
  isIosInApp: boolean;
}

interface BigBannerItemProps {
  onClick: () => {};
  linkUrl: string;
}

type Props = BigBannerItemStateProps & BigBannerItemProps;

export const BigBannerItem: React.SFC<Props> = (props) => {
  const { isIosInApp, onClick, linkUrl, children, env } = props;
  const compProps = {
    className: 'BigBanner_Item',
    onClick,
    children,
  };
  const ridiselectReg = new RegExp(`^https?:${env.SELECT_URL}/`);
  const schemeReg = /^https?:\/\//;

  if (ridiselectReg.test(linkUrl) || !schemeReg.test(linkUrl)) {
    const linkProps = { ...compProps, to: linkUrl };
    return <Link {...linkProps}/>;
  }
  if (isIosInApp) {
    return null;
  }
  const anchorProps = { ...compProps, href: linkUrl };
  return <a {...anchorProps}/>;
};

const mapStateToProps = (state: RidiSelectState, ownProps: BigBannerItemProps): BigBannerItemStateProps => {
  return {
    env: state.environment,
    isIosInApp: getIsIosInApp(state),
  };
};

export const ConnectedBigBannerItem = connect(mapStateToProps, null)(BigBannerItem);
