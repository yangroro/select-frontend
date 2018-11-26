import { FetchStatusFlag } from 'app/constants';
import { BookDetailResponse, BookDetailResponseV1, BookDetailResponseV2 } from 'app/services/book/requests';
import { RGB } from 'app/services/commonUI';
import {
  BookId,
} from 'app/types';

export enum AuthorKeys {
  'author' = 'author',
  'storyWriter' = 'storyWriter',
  'illustrator' = 'illustrator',
  'translator' = 'translator',
  'authorPhoto' = 'authorPhoto',
  'originalAuthor' = 'originalAuthor',
}
export const authorKeys: AuthorKeys[] = [
  AuthorKeys.author,
  AuthorKeys.storyWriter,
  AuthorKeys.illustrator,
  AuthorKeys.translator,
  AuthorKeys.authorPhoto,
  AuthorKeys.originalAuthor,
];
export const authorKoreanNames = {
  [AuthorKeys.author]: '저', // It can be "글, 그림" if the type of book is comic
  [AuthorKeys.storyWriter]: '글',
  [AuthorKeys.illustrator]: '그림',
  [AuthorKeys.translator]: '역',
  [AuthorKeys.authorPhoto]: '사진',
  [AuthorKeys.originalAuthor]: '원작',
};

export interface BookAuthor {
  id?: number;
  name: string;
}

export interface BookAuthors {
  [role: string]: BookAuthor[];
}

export interface BookTitle {
  main: string;
  sub?: string;
  prefix?: string;
}

export interface BookReviewSummary {
  buyerRatingAverage: number;
  buyerRatingCount: number;
  buyerRatingDistribution: number[];
  buyerReviewCount: number;
  totalRatingCount: number;
  totalReviewCount: number;
}

export interface BookThumbnailUrlMap {
  small?: string;
  large?: string;
  xxlarge?: string;
}

export interface Book {
  id: BookId;
  title: BookTitle;
  thumbnail: BookThumbnailUrlMap;
  authors: BookAuthors;
  reviewSummary?: BookReviewSummary;
}

export interface BookOwnershipStatus {
  isCurrentlyUsedRidiSelectBook: boolean;
  isDownloadAvailable: boolean;
}

export interface StaticBookState {
  book?: Book;
  bookDetail?: BookDetailResponse;
  dominantColor?: RGB;
}

export interface LegacyStaticBookState {
  book?: Book;
  bookDetail?: BookDetailResponseV1 | BookDetailResponseV2;
  dominantColor?: RGB;
}

export interface LocalStorageStaticBookState {
  [bookId: number]: LegacyStaticBookState;
}

export interface BookStateItem extends StaticBookState {
  isFetched: boolean; // Hmm
  isDetailFetched: boolean;
  detailFetchStatus: FetchStatusFlag;
  ownershipFetchStatus: FetchStatusFlag;
  ownershipStatus?: BookOwnershipStatus;
}

export interface BookState {
  [bookId: number]: BookStateItem;
}

export const bookInitialState: BookState = {};
