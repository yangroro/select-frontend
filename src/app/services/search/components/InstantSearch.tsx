import * as React from 'react';
import { Link } from 'react-router-dom';

import { FetchStatusFlag } from 'app/constants';
import { InstantSearchResultBook } from 'app/services/search';
import { getSortedAuthorsHtmlString, getAuthorsCount } from 'app/services/search/utils';

interface InstantSearchProps {
  keyword: string;
  isActive: boolean;
  fetchStatus: FetchStatusFlag;
  instantSearchList: InstantSearchResultBook[];
  highlightIndex: number;
  updateHighlight: (idx: number) => void;
  onSearchItemClick: (book: InstantSearchResultBook) => void;
}

export class InstantSearch extends React.PureComponent<InstantSearchProps> {
  public render() {
    const {
      keyword,
      isActive,
      fetchStatus,
      instantSearchList,
      highlightIndex,
      updateHighlight,
      onSearchItemClick,
    } = this.props;

    if (
      !isActive ||
      (fetchStatus === FetchStatusFlag.IDLE && !instantSearchList)
    ) {
      return null;
    }

    return (
      <div className="InstantSearchWrapper">
        {fetchStatus === FetchStatusFlag.FETCHING ? null : (
          <ul className="InstantSearchList">
            {instantSearchList ? instantSearchList.map((book, idx) => (
                <li
                  className={`InstantSearchItem${highlightIndex === idx ? ' focused' : ''}`}
                  onMouseOver={() => updateHighlight(idx)}
                  key={`instant_search_${idx}`}
                  onClick={() => onSearchItemClick(book)}
                >
                  <Link
                    className="InstantSearchedName"
                    to={`/book/${book.id}?q=${encodeURIComponent(keyword)}&s=instant`}
                  >
                    <span
                      className="InstantSearchTitle"
                      dangerouslySetInnerHTML={{__html: book.highlightTitle ? book.highlightTitle : book.title}}
                    />
                    <span
                      className="InstantSearchAuthor"
                      dangerouslySetInnerHTML={{__html: getSortedAuthorsHtmlString(
                        book.highlightAuthor ? book.highlightAuthor : book.author,
                        getAuthorsCount(book.author),
                        2
                      )}}
                    />
                    <span
                      className="InstantSearchPublisher"
                      dangerouslySetInnerHTML={{__html: book.highlightPublisher ? book.highlightPublisher : book.publisher}}
                    />
                  </Link>
                </li>
              )) : null
            }
          </ul>
        )}
      </div>
    );
  }
}
