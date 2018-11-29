import * as React from 'react';
import { connect } from 'react-redux';
import { EnvironmentState } from 'app/services/environment';
import { RidiSelectState } from 'app/store';
import { Link } from 'react-router-dom';

interface BigBannerItemStateProps {
  env: EnvironmentState;
}

interface BigBannerItemProps {
  onClick: () => {};
  linkUrl: string;
}

type Props = BigBannerItemStateProps & BigBannerItemProps

export const BigBannerItem: React.SFC<Props> = (props) => {
  const { onClick, linkUrl, children } = props;
  const compProps = {
    className: "BigBanner_Item",
    onClick,
    children,
  };
  const ridiselectReg = new RegExp(`^https?:${props.env.constants.RIDISELECT_URL}/`);
  const schemeReg = /^https?:\/\//;

  if (ridiselectReg.test(linkUrl) || !schemeReg.test(linkUrl)) {
    const linkProps = { ...compProps, to: linkUrl };
    return <Link {...linkProps}/>;
  }
  const anchorProps = { ...compProps, href: linkUrl };
  return <a {...anchorProps}/>;
}

const mapStateToProps = (state: RidiSelectState, ownProps: BigBannerItemProps): BigBannerItemStateProps => {
  return { env: state.environment };
};

export const ConnectedBigBannerItem = connect(mapStateToProps, null)(BigBannerItem);
