import { Book } from 'app/services/book';
import { BookId, Paginated } from 'app/types';

export interface SearchResultHighlight {
  title?: string;
  subTitle?: string;
  author?: string;
  translator?: string;
  publisher?: string;
}

export interface SearchResultItem {
  bookId: BookId;
  highlight: SearchResultHighlight;
  publisher: {
    name: string;
  }
}

export interface SearchResultBook extends Book {
  highlight: SearchResultHighlight;
  publisher: {
    name: string;
  }
}

export interface KeywordSearchResult extends Paginated<SearchResultItem> {}

export interface SearchResultState {
  [keyword: string]: KeywordSearchResult;
}

export const searchResultInitialState: SearchResultState = {};
