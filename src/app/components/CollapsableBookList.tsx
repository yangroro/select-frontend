import * as classNames from 'classnames';
import { take } from 'lodash';
import * as React from 'react';
import MediaQuery from 'react-responsive';

import { Icon } from '@ridi/rsg';
import { ConnectedInlineHorizontalBookList } from 'app/components';
import { Book } from 'app/services/book';
import { Expander } from 'app/services/book/components/Expander';

interface CollapsableBookListProps {
  className: string;
  listTitle: string;
  uiPartTitleForTracking: string;
  books: Book[];
}

export const CollapsableBookList: React.SFC<CollapsableBookListProps> = (props: CollapsableBookListProps) =>  {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const { className, listTitle, uiPartTitleForTracking, books } = props;

  return books.length > 0 ? (
    <section
      className={classNames(
        'CollapsableBookList',
        `CollapsableBookList-${isCollapsed ? 'collapsed' : 'expanded'}`,
        className,
      )}
    >
        <h2 className="CollapsableBookList_Title">{listTitle}</h2>
        <MediaQuery maxWidth={432}>
          {(isMobile) => (
            <>
              <ConnectedInlineHorizontalBookList
                books={isCollapsed && !isMobile ? take(books, 6) : books}
                uiPartTitleForTracking={uiPartTitleForTracking}
                disableInlineOnPC={!isCollapsed}
                renderAuthor={false}
                lazyloadThumbnail={false}
              />
              {!isMobile && (
                <div className="CollapsableBookList_ExpandButton_Wrapper">
                  <Expander
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    text="펼쳐 보기"
                    isExpanded={!isCollapsed}
                  />
                </div>
              )}
            </>
          )}
        </MediaQuery>

    </section>
  ) : null;
};
