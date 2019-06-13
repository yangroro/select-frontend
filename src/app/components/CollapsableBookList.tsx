import * as classNames from 'classnames';
import { take } from 'lodash';
import * as React from 'react';
import MediaQuery from 'react-responsive';

import { ConnectedInlineHorizontalBookList } from 'app/components';
import { Book } from 'app/services/book';

interface CollapsableBookListProps {
  className: string;
  listTitle: string;
  uiPartTitleForTracking: string;
  books: Book[];
}

export const CollapsableBookList: React.SFC<CollapsableBookListProps> = (props: CollapsableBookListProps) =>  {
  const [isCollapsed, setIsCollapsed] = React.useState(true);
  const { className, listTitle, uiPartTitleForTracking, books } = props;

  return (
    <section
      className={classNames(
        'CollapsableBookList',
        `CollapsableBookList-${isCollapsed ? 'collapsed' : 'expanded'}`,
        className,
      )}
    >
        <h2 className="ListTitle">{listTitle}</h2>
        <MediaQuery maxWidth={432}>
          {(isMobile) => (
            <>
              <ConnectedInlineHorizontalBookList
                books={isCollapsed && !isMobile ? take(books, 5) : books}
                uiPartTitleForTracking={uiPartTitleForTracking}
                renderAuthor={false}
              />
              {!isMobile && (
                <button
                  className="CollapsableBookList_ExpandButton"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  펼쳐 보기
                </button>
              )}
            </>
          )}
        </MediaQuery>

    </section>
  );
};
