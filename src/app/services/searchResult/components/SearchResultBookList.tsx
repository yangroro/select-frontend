import { DTOBookThumbnail } from 'app/components/DTOBookThumbnail';
import { SearchResultBook } from 'app/services/searchResult';
import { getSortedAuthorsHtmlString } from 'app/utils/search';
import { getDTOAuthorsCount, stringifyAuthors } from 'app/utils/utils';
import * as React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  keyword: string;
  books: SearchResultBook[];
}

export const SearchResultBookList: React.SFC<Props> = (props) => {
  const { keyword, books } = props;

  return (
    <ul className="SearchResultBookList">
      {books.map((book) => (
        <li className="SearchResultBookList_Item" key={book.id}>
          <div className="SearchResultBookList_Link">
            <DTOBookThumbnail
              book={book}
              width={100}
              linkUrl={`/book/${book.id}?q=${keyword}&s=search`}
              linkType="Link"
              sizeWrapperClassName="SearchResultBookList_Thumbnail"
            />
            <Link to={`/book/${book.id}?q=${keyword}&s=search`} className="SearchResultBookList_Meta">
              <h3
                className="SearchResultBookList_Title"
                dangerouslySetInnerHTML={{ __html: book.highlight.title || book.title.main }}
              />
              <span
                className="SearchResultBookList_Authors"
                dangerouslySetInnerHTML={{
                   __html: book.highlight.author
                    ? getSortedAuthorsHtmlString(book.highlight.author, getDTOAuthorsCount(book.authors), 2)
                    : stringifyAuthors(book.authors, 2),
                }}
              />
              <span
                className="SearchResultBookList_Publisher"
                dangerouslySetInnerHTML={{ __html: book.highlight.publisher || book.publisher.name }}
              />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
};
