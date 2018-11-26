import { FetchStatusFlag } from 'app/constants';
import { Book } from 'app/services/book';
import { Paginated } from 'app/types';

export interface MySelectBook extends Book {
  mySelectBookId: number;
  startDate: string;
  endDate: string;
}

export interface PaginatedMySelectBooks extends Paginated<MySelectBook> {
  size: number;
}

export interface MySelectState {
  deletionFetchStatus: FetchStatusFlag;
  additionFetchStatus: FetchStatusFlag;
  replacementFetchStatus: FetchStatusFlag;
  mySelectBooks: PaginatedMySelectBooks;
}

export const mySelectInitialState: MySelectState = {
  deletionFetchStatus: FetchStatusFlag.IDLE,
  additionFetchStatus: FetchStatusFlag.IDLE,
  replacementFetchStatus: FetchStatusFlag.IDLE,
  mySelectBooks: {
    itemListByPage: {},
    size: 0,
  },
};
