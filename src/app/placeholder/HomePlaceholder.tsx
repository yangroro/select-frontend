import * as React from 'react';

import { InlineHorizontalBookListSkeleton } from 'app/placeholder/BookListPlaceholder';

export const HomePlaceholder: React.SFC = () => (
  <div className="PageHome Skeleton_Wrapper">
    <div className="BigBannerSkeleton">
        <div className="Skeleton" />
    </div>
    <div className="HomeSection_Skeleton">
      <div className="HomeSection_Header_Skeleton Skeleton" />
      <InlineHorizontalBookListSkeleton />
    </div>
    <div className="HomeSection_Skeleton">
      <div className="HomeSection_Header_Skeleton Skeleton" />
      <InlineHorizontalBookListSkeleton />
    </div>
  </div>
)
