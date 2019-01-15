import { createReducer, createAction } from 'redux-act';

import { FetchStatusFlag } from 'app/constants';
import { SelectionType } from 'app/services/home';
import { BookId, Paginated } from 'app/types';
import { SelectionResponse } from 'app/services/selection/requests';

export type ReservedSelectionIds = 'popular' | 'recent' | 'hotRelease';
export type SelectionId = number | ReservedSelectionIds;

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

export interface ReservedSelectionState extends Paginated<BookId>, SelectionState {
  id: ReservedSelectionIds;
}

export interface ChartSelectionState extends ReservedSelectionState {
  alias?: string;
  sortBy?: ChartSortingCrietria;
}

export interface HotReleaseSelectionState extends Paginated<BookId>, SelectionState {
  id: ReservedSelectionIds;
}

export interface SelectionsState {
  [selectionId: number]: DefaultSelectionState;
  recent: ReservedSelectionState;
  popular: ChartSelectionState;
  hotRelease: HotReleaseSelectionState;
}

export const Actions = {
  updateSelections: createAction<{
    selections: SelectionResponse[],
  }>('updateSelections'),

  updateHotRelease: createAction<{
    hotRelease: SelectionResponse
  }>('updateHotRelease'),

  loadSelectionRequest: createAction<{
    selectionId: SelectionId,
    page: number,
  }>('loadSelectionRequest'),

  loadSelectionSuccess: createAction<{
    selectionId: SelectionId,
    page: number,
    response: SelectionResponse,
  }>('loadSelectionSuccess'),

  loadSelectionFailure: createAction<{
    selectionId: SelectionId,
    page: number,
  }>('loadSelectionSuccess'),
};

export const INITIAL_STATE: SelectionsState = {
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

export const selectionReducer = createReducer<SelectionsState>({}, INITIAL_STATE);

selectionReducer.on(Actions.updateSelections, (state = INITIAL_STATE, { selections = [] }) => {
  return selections.reduce((prev, selection) => {
    // Don't need to update data if data exists
    const { collectionId } = selection;
    if (!!state[collectionId]) {
      prev[collectionId] = state[collectionId];
    } else {
      prev[collectionId] = {
        ...state[collectionId],
        id: collectionId,
        itemCount: selection.totalCount, // TODO: Ask to @minq if we can get this number in home response
        itemListByPage: {
          1: {
            fetchStatus: FetchStatusFlag.IDLE,
            itemList: selection.books.map((book) => book.id),
            isFetched: false,
          },
        },
        pageCount: 0,
        title: selection.title,
        type: selection.type,
      };
    }
    return prev;
  }, state);
});

selectionReducer.on(Actions.updateHotRelease, (state = INITIAL_STATE, { hotRelease }) => ({
  ...state,
  hotRelease: {
    ...state.hotRelease,
    itemListByPage: {
      1: {
        fetchStatus: FetchStatusFlag.IDLE,
        itemList: hotRelease.books.map((book) => book.id),
        isFetched: false,
      },
    },
    pageCount: 0,
    title: hotRelease.title,
    type: hotRelease.type,
  }
}));

selectionReducer.on(Actions.loadSelectionRequest, (state = INITIAL_STATE, { page, selectionId }) => ({
  ...state,
  [selectionId]: {
    ...state[selectionId],
    id: selectionId,
    itemCount: 0,
    itemListByPage: {
      ...(state[selectionId] && state[selectionId].itemListByPage),
      [page]: {
        fetchStatus: FetchStatusFlag.FETCHING,
        itemList: [],
        isFetched: false,
      },
    },
  },
}));

selectionReducer.on(Actions.loadSelectionSuccess, (state = INITIAL_STATE, { page, selectionId, response }) => ({
  ...state,
  [selectionId]: {
    ...state[selectionId],
    itemListByPage: {
      ...state[selectionId].itemListByPage,
      [page]: {
        fetchStatus: FetchStatusFlag.IDLE,
        itemList: response.books.map((book) => book.id),
        isFetched: true,
      },
    },
    title: response.title,
    id: response.collectionId,
    itemCount: response.totalCount,
    type: response.type,
  },
}));

selectionReducer.on(Actions.loadSelectionFailure, (state = INITIAL_STATE, { selectionId, page }) => ({
  ...state,
  [selectionId]: {
    ...state[selectionId],
    itemListByPage: {
      ...state[selectionId].itemListByPage,
      [page]: {
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
        itemList: [],
        isFetched: false,
      },
    },
  },
}));
