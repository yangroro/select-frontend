import * as classNames from 'classnames';
import * as React from 'react';
import MediaQuery from 'react-responsive';

import { ConnectedInlineHorizontalBookList } from 'app/components';
import { Book } from 'app/services/book';
import { Expander } from 'app/services/book/components/Expander';

interface ExpandableBookListProps {
  className: string;
  listTitle: string;
  uiPartTitleForTracking: string;
  books?: Book[];
}

export const ExpandableBookList: React.FunctionComponent<ExpandableBookListProps> = (props) =>  {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { className, listTitle, uiPartTitleForTracking, books } = props;

  return books && books.length > 0 ? (
    <section
      className={classNames(
        'ExpandableBookList',
        isExpanded && 'ExpandableBookList-expanded',
        className,
      )}
    >
        <h2 className="ExpandableBookList_Title">{listTitle}</h2>
        <MediaQuery maxWidth={840}>
          {(isMobile) => (
            <>
              <ConnectedInlineHorizontalBookList
                books={(isExpanded || isMobile) ? books : books.slice(0, 6)}
                uiPartTitleForTracking={uiPartTitleForTracking}
                disableInlineOnPC={isExpanded}
                renderAuthor={false}
                lazyloadThumbnail={false}
              />
              {(!isMobile && !isExpanded) && (
                <div className="ExpandableBookList_ExpandButton_Wrapper">
                  <Expander
                    onClick={() => setIsExpanded(!isExpanded)}
                    text={isExpanded ? '접기' : '펼쳐 보기'}
                    isExpanded={isExpanded}
                  />
                </div>
              )}
            </>
          )}
        </MediaQuery>

    </section>
  ) : null;
};
