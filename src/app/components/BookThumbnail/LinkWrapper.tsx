import { ThumbnailLinkType } from 'app/components/BookThumbnail/types';
import * as classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';

export interface LinkWrapperProps {
  className?: string;
  linkUrl?: string;
  linkType: ThumbnailLinkType;
  onClick: (event: React.SyntheticEvent<any>) => void;
}

export const LinkWrapper: React.SFC<LinkWrapperProps> = (props) => {
  const {
    className,
    linkUrl,
    linkType,
    onClick,
    children,
  } = props;

  if (!linkUrl) {
    return <>{children}</>;
  }

  switch (linkType) {
    case 'Link':
      return (
        <Link
          to={linkUrl}
          className={classNames(['RSGBookThumbnail_Link', className])}
          onClick={onClick}
        >
          {children}
        </Link>
      );
    case 'a':
      return (
        <a
          href={linkUrl}
          className={classNames(['RSGBookThumbnail_Link', className])}
          onClick={onClick}
        >
          {children}
        </a>
      );
    case 'button':
      return (
        <button
          className={classNames(['RSGBookThumbnail_Link', className])}
          onClick={onClick}
        >
          {children}
        </button>
      );
  }
};
