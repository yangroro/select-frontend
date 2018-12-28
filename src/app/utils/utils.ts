import { flatMap } from "lodash-es";

import {
  authorKeys,
  authorKoreanNames,
  BookAuthors,
  AuthorKeys,
  BookAuthor
} from "app/services/book";

export const setFixedScrollToTop = (isFixed: boolean) => {
  if (isFixed) {
    document.body.classList.add('scrollFixedToTop');
  } else {
    document.body.classList.remove('scrollFixedToTop');
  }
}

export const setDisableScroll = (isDisabled: boolean) => {
  if (isDisabled) {
    document.body.classList.add('App-disableScroll');
  } else {
    document.body.classList.remove('App-disableScroll');
  }
}

export const buildAuthorString = (authors: BookAuthor[], suffix: string, authorLimitCount?: number): string => {
  if (!authors) {
    return '';
  }
  if (authorLimitCount && authors.length > authorLimitCount) {
    const expandedAuthors = authors
      .slice(0, authorLimitCount)
      .map(author => author.name)
      .join(', ');
    return `${expandedAuthors} 외 ${authors.length - authorLimitCount}명 ${suffix}`;
  }
  return authors
    .map(author => author.name)
    .join(', ')
    .concat(` ${suffix}`);
}

export const stringifyAuthors = (authors: BookAuthors, authorLimitCount?: number): string =>
  authorKeys
    .map((key: AuthorKeys) => buildAuthorString(authors[key], authorKoreanNames[key], authorLimitCount))
    .filter((str: string) => str.length > 0)
    .join(', ');

export function getDTOAuthorsCount(authors: BookAuthors): number {
  return flatMap(authors, (value) => value).length;
}
