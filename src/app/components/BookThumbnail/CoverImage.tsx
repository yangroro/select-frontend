import * as classNames from 'classnames';
import * as React from 'react';

import { getThumbnailHeight } from 'app/components/BookThumbnail/helpers';
import { ThumbnailSize } from 'app/components/BookThumbnail/types';

export interface CoverImageProps {
  className?: string;
  src: string;
  alt: string;
  width: ThumbnailSize;
  shadow: boolean;
}

interface CoverImageState {
  isLoaded: boolean;
  isEndTransition: boolean;
}

export class CoverImage extends React.Component<CoverImageProps, CoverImageState> {
  private coverPlaceholder: HTMLSpanElement;
  public state: CoverImageState = {
    isLoaded: false,
    isEndTransition: false,
  };

  public componentDidUpdate() {
    if (this.coverPlaceholder) {
      this.coverPlaceholder.addEventListener(
        'transitionend',
        () => this.setState({ isEndTransition: true }),
      );
    }
  }

  public render() {
    const {
      className,
      src,
      alt,
      shadow,
      width,
    } = this.props;
    const { isLoaded, isEndTransition } = this.state;

    return (
      <>
        <img
          className={classNames('RSGBookThumbnail_CoverImage', className)}
          src={src}
          alt={alt}
          onLoad={() => this.setState({ isLoaded: true })}
        />
        {shadow && <span className="RSGBookThumbnail_CoverImage_Shadow" />}
        {isLoaded && isEndTransition ? null : (
          <span
            className={classNames(
              'Skeleton',
              'CoverImage_Placeholder',
              isLoaded ? 'CoverImage_Placeholder-fadeout' : null,
            )}
            style={{
              width,
              height: getThumbnailHeight(width),
            }}
            ref={(ref) => (this.coverPlaceholder = ref!)}
          />
        )}
      </>
    );
  }
}
