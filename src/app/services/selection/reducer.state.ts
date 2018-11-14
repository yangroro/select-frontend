import { SelectionType } from 'app/services/home';
import {
  BookId,
  Paginated,
} from 'app/types';

export enum ChartSortingCrietria {
  default,
}

export interface SelectionState {
  title?: string;
  type?: SelectionType;
}

export interface DefaultSelectionState extends Paginated<BookId>, SelectionState {
  id: number;
}

export type ReservedSelectionIds = 'popular'|'recent';
export interface ReservedSelectionState extends Paginated<BookId>, SelectionState {
  id: ReservedSelectionIds;
}

export interface ChartSelectionState extends ReservedSelectionState {
  alias?: string;
  sortBy?: ChartSortingCrietria;
}

export interface SelectionsState {
  [selectionId: number]: DefaultSelectionState;
  recent: ReservedSelectionState;
  popular: ChartSelectionState;
}

export const selectionInitialState: SelectionsState = {
  popular: {
    id: 'popular',
    itemListByPage: {},
  },
  recent: {
    id: 'recent',
    itemListByPage: {},
  },
};
