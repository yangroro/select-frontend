import { FetchStatusFlag } from 'app/constants';
import { Book } from 'app/services/book';

export interface MySelectBook extends Book {
  mySelectBookId: number;
  startDate: string;
  endDate: string;
}

export interface MySelectState {
  fetchStatus: FetchStatusFlag;
  deletionFetchStatus: FetchStatusFlag;
  additionFetchStatus: FetchStatusFlag;
  replacementFetchStatus: FetchStatusFlag;
  books: MySelectBook[];
  isFetched: boolean;
  replacingBookId: number | null;
}

export const mySelectInitialState: MySelectState = {
  fetchStatus: FetchStatusFlag.IDLE,
  deletionFetchStatus: FetchStatusFlag.IDLE,
  additionFetchStatus: FetchStatusFlag.IDLE,
  replacementFetchStatus: FetchStatusFlag.IDLE,
  books: [],
  isFetched: false,
  replacingBookId: null,
};
