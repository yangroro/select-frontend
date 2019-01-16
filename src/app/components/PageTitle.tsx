import * as classNames from 'classnames';
import * as React from 'react';

export interface PageTitleProps {
  underline?: boolean;
}

export const PageTitle: React.SFC<PageTitleProps> = ({
  underline,
  children,
}) => (
  <h1 className={classNames([
    'PageTitle',
    { underline },
  ])}>
    {children}
  </h1>
);
