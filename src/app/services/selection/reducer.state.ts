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

export type ReservedSelectionIds = 'popular'|'recent'|'hotRelease';
export interface ReservedSelectionState extends Paginated<BookId>, SelectionState {
  id: ReservedSelectionIds;
}

export interface ChartSelectionState extends ReservedSelectionState {
  alias?: string;
  sortBy?: ChartSortingCrietria;
}

export interface HotReleaseSelectionState extends Paginated<BookId>, SelectionState {
  id: string;
}

export interface SelectionsState {
  [selectionId: number]: DefaultSelectionState;
  recent: ReservedSelectionState;
  popular: ChartSelectionState;
  hotRelease: HotReleaseSelectionState;
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
  hotRelease: {
    id: 'hotRelease',
    itemListByPage: {},
  }
};
