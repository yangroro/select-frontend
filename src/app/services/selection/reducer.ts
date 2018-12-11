import { FetchStatusFlag } from 'app/constants';

import {
  selectionInitialState,
  SelectionsState,
} from 'app/services/selection';
import {
  LOAD_SELECTION_FAILURE,
  LOAD_SELECTION_REQUEST,
  LOAD_SELECTION_SUCCESS,
  SelectionActionTypes,
  UPDATE_SELECTIONS,
} from 'app/services/selection/actions';

export const selectionReducer = (
  state = selectionInitialState,
  action: SelectionActionTypes,
): SelectionsState => {
  switch (action.type) {
    case UPDATE_SELECTIONS:
      const { selections = [] } = action.payload!;
      const newState: SelectionsState = selections.reduce((prev, selection) => {
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
      return newState;
    case LOAD_SELECTION_REQUEST: {
      const { page, selectionId } = action.payload!;
      return {
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
      };
    }
    case LOAD_SELECTION_SUCCESS: {
      const { selectionId, response, page } = action.payload!;
      return {
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
      };
    }
    case LOAD_SELECTION_FAILURE: {
      const { selectionId, page } = action.payload!;
      return {
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
      };
    }
    default:
      return state;
  }
};
