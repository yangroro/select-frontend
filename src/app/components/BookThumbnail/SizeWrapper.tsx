import * as classNames from 'classnames';
import * as React from 'react';

import { ThumbnailSize, DEFAULT_THUMBNAIL_SIZE } from 'app/components/BookThumbnail/types';
import { getThumbnailHeight } from 'app/components/BookThumbnail/helpers';

export interface SizeWrapperProps {
  className?: string;
  width?: ThumbnailSize;
};

export const SizeWrapper: React.SFC<SizeWrapperProps> = (props) => {
  const {
    className,
    width = DEFAULT_THUMBNAIL_SIZE,
    children,
  } = props;

  const sizeStyle = {
    width,
    height: getThumbnailHeight(width),
    maxHeight: getThumbnailHeight(width),
  };

  return (
    <div
      className={classNames([
        'RSGBookThumbnail',
        className,
      ])}
      style={sizeStyle}
    >
      {children}
    </div>
  );
};
