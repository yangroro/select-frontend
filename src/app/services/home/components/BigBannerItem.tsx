import { EnvironmentState } from 'app/services/environment';
import { isRidiselectUrl } from 'app/utils/regexHelper';
import * as React from 'react';
import { Link } from 'react-router-dom';

interface BigBannerItemProps {
  onClick: () => {};
  linkUrl: string;
}

export const BigBannerItem: React.SFC<BigBannerItemProps> = (props) => {
  const { onClick, linkUrl, children } = props;
  const compProps = {
    className: 'BigBanner_Item',
    onClick,
    children,
  };
  if (isRidiselectUrl(linkUrl)) {
    const linkProps = { ...compProps, to: linkUrl };
    return <Link {...linkProps}/>;
  }
  const anchorProps = { ...compProps, href: linkUrl };
  return <a {...anchorProps}/>;
};
