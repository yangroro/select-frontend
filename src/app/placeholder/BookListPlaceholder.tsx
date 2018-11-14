import * as React from 'react';
import { range } from 'lodash-es';

interface GridBookListSkeletonProps {
  displayRanking?: boolean;
}

interface LandscapeBookListSkeletonProps {
  hasCheckbox?: boolean;
}

interface BookSkeletonProps {
  hasCheckbox?: boolean;
}

export const BookSkeleton: React.SFC<BookSkeletonProps> = (props) => {
  const { hasCheckbox } = props;

  return (
    <div className='Book_Skeleton'>
      {hasCheckbox ? (
        <div className="Checkbox_Skeleton_Wrapper">
          <span className="Checkbox_Skeleton Skeleton" />
        </div>
      ) : null}
      <span className="Skeleton Thumbnail_Skeleton" />
      <div className="BookMetadata_Wrapper">
        <span className="Skeleton Title_Skeleton" />
        <span className="Skeleton Author_Skeleton" />
      </div>
    </div>
  );
};

export const InlineHorizontalBookListSkeleton: React.SFC = () => (
  <ul className="InlineHorizontalBookList_Skeleton">
    {range(0, 12).map((value, index) => (
      <li
        className="InlineHorizontalBookList_Item_Skeleton"
        key={`skeltonBook_${index}`}
      >
        <BookSkeleton />
      </li>
    ))}
  </ul>
);

export const GridBookListSkeleton: React.SFC<GridBookListSkeletonProps> = (props) => {
  const { displayRanking } = props;

  return (
    <ul className="GridBookList_Skeleton">
      {range(0, 12).map((value, index) => (
        <li className="GridBookList_Item_Skeleton" key={index}>
          {displayRanking ? (<div className="Ranking_Placeholder Skeleton" />) : null}
          <BookSkeleton />
        </li>
      ))}
    </ul>
  );
};

export const LandscapeBookListSkeleton: React.SFC<LandscapeBookListSkeletonProps> = (props) => {
  const { hasCheckbox } = props;

  return (
    <ul className="LandscapeBookList_Skeleton">
      {range(0, 2).map((value, index) => (
        <li className="LandscapeBookList_Item_Skeleton" key={index}>
          <BookSkeleton
            hasCheckbox={hasCheckbox ? true : false}
          />
        </li>
      ))}
    </ul>
  );
};
