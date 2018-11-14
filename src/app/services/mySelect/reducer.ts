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
  REPLACE_MY_SELECT_FAILURE,
  REPLACE_MY_SELECT_REQUEST,
  REPLACE_MY_SELECT_SUCCESS,
  DELETE_MY_SELECT_FAILURE,
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
      return {
        ...state,
        fetchStatus: FetchStatusFlag.FETCHING,
      };
    }
    case LOAD_MY_SELECT_SUCCESS: {
      const { response } = action.payload!;
      return {
        ...state,
        books: response.userRidiSelectBooks.map(userRidiSelectBookToMySelectBook),
        fetchStatus: FetchStatusFlag.IDLE,
        isFetched: true,
      };
    }
    case LOAD_MY_SELECT_FAILURE: {
      return {
        ...state,
        books: state.books,
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
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
        books: state.books.filter((book) => {
          return !action.payload!.mySelectBookIds.includes(book.mySelectBookId);
        }),
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
        books: [
          userRidiSelectBookToMySelectBook(action.payload!.userRidiSelectResponse),
          ...state.books,
        ]
      };
    }
    case ADD_MY_SELECT_FAILURE: {
      return {
        ...state,
        additionFetchStatus: FetchStatusFlag.FETCH_ERROR,
      };
    }
    case REPLACE_MY_SELECT_REQUEST: {
      return {
        ...state,
        replacingBookId: action.payload!.mySelectBookId,
        replacementFetchStatus: FetchStatusFlag.FETCHING,
      };
    }
    case REPLACE_MY_SELECT_SUCCESS: {
      const { mySelectBookId, userRidiSelectResponse } = action.payload!;
      return {
        ...state,
        replacementFetchStatus: FetchStatusFlag.IDLE,
        replacingBookId: null,
        books: [
          ...state.books.filter((book) => book.mySelectBookId !== mySelectBookId),
          userRidiSelectBookToMySelectBook(userRidiSelectResponse),
        ],
      };
    }
    case REPLACE_MY_SELECT_FAILURE: {
      return {
        ...state,
        replacingBookId: null,
        replacementFetchStatus: FetchStatusFlag.FETCH_ERROR,
      };
    }
    default:
      return state;
  }
};
