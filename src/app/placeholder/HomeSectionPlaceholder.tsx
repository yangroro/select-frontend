import * as React from 'react';

import { InlineHorizontalBookListSkeleton } from 'app/placeholder/BookListPlaceholder';

export const HomeSectionPlaceholder: React.SFC = () => (
  <div className="PageHome Skeleton_Wrapper">
    <div className="HomeSection_Skeleton">
      <div className="HomeSection_Header Skeleton" />
      <InlineHorizontalBookListSkeleton />
    </div>
    <div className="HomeSection_Skeleton">
      <div className="HomeSection_Header Skeleton" />
      <InlineHorizontalBookListSkeleton />
    </div>
  </div>
)
