import * as classNames from 'classnames';
import * as React from 'react';

export interface CoverImageProps {
  className?: string;
  src: string;
  alt: string;
  shadow: boolean;
};

export const CoverImage: React.SFC<CoverImageProps> = (props) => {
  const {
    className,
    src,
    alt,
    shadow,
  } = props;

  return (
    <>
      <img
        className={classNames('RSGBookThumbnail_CoverImage', className)}
        src={src}
        alt={alt}
      />
      {shadow && <span className='RSGBookThumbnail_CoverImage_Shadow' />}
    </>
  );
}
