import { DefaultSelectionState } from 'app/services/selection';
import { FetchStatusFlag } from 'app/constants';

export interface Category {
  id: number;
  name: string;
}

export type CategoryListState = {
  lastSelectedCategoryId?: number;
  itemList: Category[];
  fetchStatus: FetchStatusFlag;
  isFetched: boolean;
};

export const categoryListInitialState: CategoryListState = {
  lastSelectedCategoryId: undefined,
  itemList: [],
  fetchStatus: FetchStatusFlag.IDLE,
  isFetched: false,
};

/** Divide reducer to keep root state as flat as possible */
export interface CategoryCollectionState extends DefaultSelectionState {
  name: string;
}

export interface CategoryBooksState {
  [categoryId: number]: CategoryCollectionState;
}

export const categoryBooksInitialState: CategoryBooksState = {};
