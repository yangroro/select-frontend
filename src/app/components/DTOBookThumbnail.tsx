import * as React from 'react';

import {
  BookThumbnail,
  BookThumbnailProps,
} from './BookThumbnail';
import {
  BookThumbnailUrlMap,
  Book,
} from 'app/services/book';
import { Omit } from 'app/types';
import { withThumbnailQuery } from 'app/utils/withThumbnailQuery';

export interface DTOBookThumbnailProps extends Omit<BookThumbnailProps, 'bookTitle' | 'imageUrl'> {
  book: Book;
  imageSize?: keyof BookThumbnailUrlMap;
}

export const DTOBookThumbnail: React.SFC<DTOBookThumbnailProps> = (props) => {
  const {
    book,
    imageSize = 'large',
    ...restProps
  } = props;

  return (
    <BookThumbnail
      imageUrl={withThumbnailQuery(book.thumbnail[imageSize]!)}
      bookTitle={book.title.main}
      {...restProps}
    />
  )
}
