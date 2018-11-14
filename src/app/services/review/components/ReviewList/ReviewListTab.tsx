import * as React from 'react';
import MediaQuery from 'react-responsive';

import { RSGTab, ScopedTab, ScopedTabProps } from 'app/services/review/components';

export type ReviewListTabProps = ScopedTabProps;

export const ReviewListTab: React.SFC<ReviewListTabProps> = (props) => {
  const { tabList, selectedTabName, onClick } = props;

  return (
    <>
      <MediaQuery maxWidth={840}>
        <ScopedTab
          tabList={tabList}
          selectedTabName={selectedTabName}
          onClick={onClick}
        />
      </MediaQuery>
      <MediaQuery minWidth={841}>
        <RSGTab
          tabList={tabList}
          selectedTabName={selectedTabName}
          onClick={onClick}
        />
      </MediaQuery>
    </>
  );
};
