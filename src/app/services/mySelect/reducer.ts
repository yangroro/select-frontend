import { FetchStatusFlag } from 'app/constants';
import {
  ADD_MY_SELECT_FAILURE,
  ADD_MY_SELECT_REQUEST,
  ADD_MY_SELECT_SUCCESS,
  DELETE_MY_SELECT_REQUEST,
  DELETE_MY_SELECT_SUCCESS,
  LOAD_MY_SELECT_FAILURE,
  LOAD_MY_SELECT_REQUEST,
  LOAD_MY_SELECT_SUCCESS,
  MySelectActionTypes,
  DELETE_MY_SELECT_FAILURE,
  RESET_MY_SELECT_PAGE_FETCHED_STATUS,
} from 'app/services/mySelect/actions';
import { MySelectBook, mySelectInitialState, MySelectState } from 'app/services/mySelect/reducer.state';
import { UserRidiSelectBookResponse } from 'app/services/mySelect/requests';

export const userRidiSelectBookToMySelectBook = (userRidiSelectbook: UserRidiSelectBookResponse): MySelectBook => {
  return {
    ...userRidiSelectbook.book,
    startDate: userRidiSelectbook.startDate,
    endDate: userRidiSelectbook.endDate,
    mySelectBookId: userRidiSelectbook.id,
  };
};

export const mySelectReducer = (
  state = mySelectInitialState,
  action: MySelectActionTypes,
): MySelectState => {
  switch (action.type) {
    case LOAD_MY_SELECT_REQUEST: {
      const { page } = action.payload!;
      return {
        ...state,
        mySelectBooks: {
          ...state.mySelectBooks,
          itemListByPage: {
            ...state.mySelectBooks.itemListByPage,
            [page]: {
              ...state.mySelectBooks.itemListByPage[page],
              fetchStatus: FetchStatusFlag.FETCHING,
              isFetched: false,
            }
          }
        },
      };
    }
    case LOAD_MY_SELECT_SUCCESS: {
      const { response, page } = action.payload!;
      return {
        ...state,
        mySelectBooks: {
          itemCount: response.totalCount,
          size: response.size,
          itemListByPage: {
            ...state.mySelectBooks.itemListByPage,
            [page]: {
              fetchStatus: FetchStatusFlag.IDLE,
              itemList: response.userRidiSelectBooks.map(userRidiSelectBookToMySelectBook),
              isFetched: true,
            }
          }
        },
      };
    }
    case LOAD_MY_SELECT_FAILURE: {
      const { page } = action.payload!;
      return {
        ...state,
        mySelectBooks: {
          ...state.mySelectBooks,
          itemListByPage: {
            ...state.mySelectBooks.itemListByPage,
            [page]: {
              ...state.mySelectBooks.itemListByPage[page],
              fetchStatus: FetchStatusFlag.FETCH_ERROR,
            }
          }
        },
      };
    }
    case DELETE_MY_SELECT_REQUEST: {
      return {
        ...state,
        deletionFetchStatus: FetchStatusFlag.FETCHING,
      };
    }
    case DELETE_MY_SELECT_SUCCESS: {
      return {
        ...state,
        deletionFetchStatus: FetchStatusFlag.IDLE,
      };
    }
    case DELETE_MY_SELECT_FAILURE: {
      return {
        ...state,
        deletionFetchStatus: FetchStatusFlag.FETCH_ERROR,
      };
    }
    case ADD_MY_SELECT_REQUEST: {
      return {
        ...state,
        additionFetchStatus: FetchStatusFlag.FETCHING,
      };
    }
    case ADD_MY_SELECT_SUCCESS: {
      return {
        ...state,
        additionFetchStatus: FetchStatusFlag.IDLE,
      };
    }
    case ADD_MY_SELECT_FAILURE: {
      return {
        ...state,
        additionFetchStatus: FetchStatusFlag.FETCH_ERROR,
      };
    }
    case RESET_MY_SELECT_PAGE_FETCHED_STATUS: {
      const { page } = action.payload!;
      return {
        ...state,
        mySelectBooks: {
          ...state.mySelectBooks,
          itemListByPage: {
            ...state.mySelectBooks.itemListByPage,
            [page]: {
              ...state.mySelectBooks.itemListByPage[page],
              isFetched: false,
            }
          }
        }
      }
    }
    default:
      return state;
  }
};
