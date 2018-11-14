import * as React from 'react';
import Lazyload from 'react-lazyload';

import { DefaultLazyloadPlaceholder } from 'app/components/BookThumbnail/DefaultLazyloadPlaceholder';
import { ThumbnailSize } from 'app/components/BookThumbnail/types';
import { getThumbnailHeight } from 'app/components/BookThumbnail/helpers';

export interface LazyloadWrapperProps {
  width: ThumbnailSize;
  lazyload: boolean;
  placeholder?: JSX.Element;
  hasOverflowWrapper?: boolean;
};

export class LazyloadWrapper extends React.Component<LazyloadWrapperProps> {
  public render() {
    const {
      width,
      lazyload,
      placeholder,
      hasOverflowWrapper,
      children
    } = this.props;

    const sizeStyle = {
      width,
      height: getThumbnailHeight(width),
    };

    return lazyload ? (
      <Lazyload
        height={sizeStyle.height}
        offset={100}
        once={true}
        throttle={true}
        resize={true}
        overflow={hasOverflowWrapper}
        placeholder={
          placeholder ||
          <DefaultLazyloadPlaceholder size={sizeStyle} />
        }
      >
        <div className="RSGBookThumbnail_Wrapper-lazyloaded">
          {children}
        </div>
      </Lazyload>
    ) : (
      <>
        {children}
      </>
    );
  }
}
