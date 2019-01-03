import * as React from 'react';

import { InlineHorizontalBookListSkeleton, ChartBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { SelectionType } from 'app/services/home';
import * as classNames from 'classnames';

interface HomeSectionPlaceholderProps {
  type?: SelectionType;
}

export const HomeSectionPlaceholder: React.SFC<HomeSectionPlaceholderProps> = (props) => (
  <div
    className={classNames(
      "HomeSection_Skeleton",
      props.type && props.type === SelectionType.CHART ?
        "HomeSection_Chart_Skeleton" : null,
    )}
  >
    <div className="HomeSection_Header Skeleton" />
    {props.type && props.type === SelectionType.CHART ?
      <ChartBookListSkeleton /> :
      <InlineHorizontalBookListSkeleton />
    }
  </div>
)
