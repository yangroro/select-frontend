import { initialUserState, UserState } from './reducer.state';

import { FetchStatusFlag } from 'app/constants';
import {
  CANCEL_PURCHASE_FAILURE,
  CANCEL_PURCHASE_REQUEST,
  CANCEL_PURCHASE_SUCCESS,
  CLEAR_MY_SELECT_HISTORY,
  CLEAR_PURCHASES,
  DELETE_MY_SELECT_HISTORY_FAILURE,
  DELETE_MY_SELECT_HISTORY_REQUEST,
  DELETE_MY_SELECT_HISTORY_SUCCESS,
  FETCH_USER_INFO,
  INITIALIZE_USER,
  LOAD_MY_SELECT_HISTORY_FAILURE,
  LOAD_MY_SELECT_HISTORY_REQUEST,
  LOAD_MY_SELECT_HISTORY_SUCCESS,
  LOAD_PURCHASES_FAILURE,
  LOAD_PURCHASES_REQUEST,
  LOAD_PURCHASES_SUCCESS,
  LOAD_SUBSCRIPTION_REQUEST,
  LOAD_SUBSCRIPTION_SUCCESS,
  UserActionTypes,
  UNSUBSCRIBE_REQUEST,
  UNSUBSCRIBE_SUCCESS,
  UNSUBSCRIBE_FAILURE,
  CANCEL_UNSUBSCRIPTION_REQUEST,
  CANCEL_UNSUBSCRIPTION_SUCCESS,
  CANCEL_UNSUBSCRIPTION_FAILURE,
} from 'app/services/user/actions';
import { Ticket } from 'app/services/user/requests';
import { ItemListByPage } from 'app/types';
import { userRidiSelectBookToMySelectBook } from 'app/services/mySelect/reducer';

export function userReducer(state = initialUserState, action: UserActionTypes): UserState {
  switch (action.type) {
    case FETCH_USER_INFO:
      return {
        ...state,
        ...action.payload,
      }
    case INITIALIZE_USER:
      return {
        ...state,
        ...action.payload,
      };
    case LOAD_SUBSCRIPTION_REQUEST:
      return {
        ...state,
        subscriptionFetchStatus: FetchStatusFlag.FETCHING,
      };
    case LOAD_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        subscription: {
          ...state.subscription,
          ...action.payload!,
        },
      };
    case LOAD_MY_SELECT_HISTORY_REQUEST: {
      return {
        ...state,
        mySelectHistory: {
          ...state.mySelectHistory,
          itemListByPage: {
            ...state.mySelectHistory.itemListByPage,
            [action.payload!.page]: {
              isFetched: false,
              itemList: [],
              fetchStatus: FetchStatusFlag.FETCHING,
            },
          },
        },
      };
    }
    case LOAD_MY_SELECT_HISTORY_SUCCESS: {
      const { response } = action.payload!;
      const { userRidiSelectBooks, totalCount, totalPage } = response;
      return {
        ...state,
        mySelectHistory: {
          ...state.mySelectHistory,
          itemCount: totalCount,
          itemListByPage: {
            ...state.mySelectHistory.itemListByPage,
            [action.payload!.page]: {
              isFetched: true,
              itemList: userRidiSelectBooks.map(userRidiSelectBookToMySelectBook),
              fetchStatus: FetchStatusFlag.IDLE,
            },
          },
        },
      };
    }
    case LOAD_MY_SELECT_HISTORY_FAILURE: {
      return {
        ...state,
        mySelectHistory: {
          ...state.mySelectHistory,
          itemListByPage: {
            ...state.mySelectHistory.itemListByPage,
            [action.payload!.page]: {
              isFetched: false,
              itemList: [],
              fetchStatus: FetchStatusFlag.FETCH_ERROR,
            },
          },
        },
      };
    }
    case CLEAR_MY_SELECT_HISTORY: {
      return {
        ...state,
        mySelectHistory: {
          ...state.mySelectHistory,
          itemCount: 0,
          pageCount: 0,
          itemListByPage: {},
        },
      };
    }
    case DELETE_MY_SELECT_HISTORY_REQUEST: {
      return {
        ...state,
        mySelectHistory: {
          ...state.mySelectHistory,
          deletionFetchingStatus: FetchStatusFlag.FETCHING,
          itemListByPage: {
            ...state.mySelectHistory.itemListByPage,
            [action.payload!.page]: {
              ...state.mySelectHistory.itemListByPage[action.payload!.page],
              fetchStatus: FetchStatusFlag.FETCHING,
            },
          },
        },
      };
    }
    case DELETE_MY_SELECT_HISTORY_SUCCESS: {
      const { response, page } = action.payload!;
      const { userRidiSelectBooks, totalCount, totalPage } = response;
      return {
        ...state,
        mySelectHistory: {
          ...state.mySelectHistory,
          itemCount: totalCount,
          pageCount: totalPage,
          deletionFetchingStatus: FetchStatusFlag.IDLE,
          itemListByPage: {
            ...state.mySelectHistory.itemListByPage,
            [page]: {
              isFetched: true,
              itemList: userRidiSelectBooks.map(userRidiSelectBookToMySelectBook),
              fetchStatus: FetchStatusFlag.IDLE,
            },
          }
        },
      };
    }
    case DELETE_MY_SELECT_HISTORY_FAILURE: {
      return {
        ...state,
        mySelectHistory: {
          ...state.mySelectHistory,
          deletionFetchingStatus: FetchStatusFlag.FETCH_ERROR,
        },
      };
    }
    case LOAD_PURCHASES_REQUEST: {
      const { page } = action.payload!;
      return {
        ...state,
        purchaseHistory: {
          ...state.purchaseHistory,
          itemListByPage: {
            ...state.purchaseHistory.itemListByPage,
            [page]: {
              fetchStatus: FetchStatusFlag.FETCHING,
              itemList: [],
              isFetched: false,
            },
          },
        },
      };
    }
    case LOAD_PURCHASES_SUCCESS: {
      const { page, response } = action.payload!;
      return {
        ...state,
        purchaseHistory: {
          ...state.purchaseHistory,
          itemCount: response.totalCount,
          itemListByPage: {
            ...state.purchaseHistory.itemListByPage,
            [page]: {
              fetchStatus: FetchStatusFlag.IDLE,
              itemList: response.tickets,
              isFetched: false,
            },
          },
        },
      };
    }
    case LOAD_PURCHASES_FAILURE: {
      const { page } = action.payload!;
      return {
        ...state,
        purchaseHistory: {
          ...state.purchaseHistory,
          itemListByPage: {
            ...state.purchaseHistory.itemListByPage,
            [page]: {
              fetchStatus: FetchStatusFlag.FETCH_ERROR,
              itemList: [],
              isFetched: false,
            },
          },
        },
      };
    }
    case CLEAR_PURCHASES: {
      return {
        ...state,
        purchaseHistory: {
          itemListByPage: {},
          isCancelFetching: false,
        },
      };
    }
    case CANCEL_PURCHASE_REQUEST: {
      return {
        ...state,
        purchaseHistory: {
          ...state.purchaseHistory,
          isCancelFetching: true,
        },
      };
    }
    case CANCEL_PURCHASE_SUCCESS: {
      const { purchaseId } = action.payload!;
      return {
        ...state,
        purchaseHistory: {
          ...state.purchaseHistory,
          itemListByPage: Object
            .keys(state.purchaseHistory.itemListByPage)
            .reduce((listByPage, p): ItemListByPage<Ticket> => {
              const page = Number(p);
              return {
                ...listByPage,
                [page]: {
                  ...state.purchaseHistory.itemListByPage[page],
                  itemList: state.purchaseHistory.itemListByPage[page].itemList.map((item) => ({
                    ...item,
                    isCancellable: item.id === purchaseId ? false : item.isCancellable,
                    isCanceled: item.id === purchaseId ? true : item.isCanceled,
                  })),
                },
              };
            }, {}),
          isCancelFetching: false,
        },
      };
    }
    case CANCEL_PURCHASE_FAILURE: {
      return {
        ...state,
        purchaseHistory: {
          ...state.purchaseHistory,
          isCancelFetching: false,
        },
      };
    }
    case UNSUBSCRIBE_REQUEST: {
      return {
        ...state,
        unsubscriptionFetchStatus: FetchStatusFlag.FETCHING,
      };
    }
    case UNSUBSCRIBE_SUCCESS: {
      return {
        ...state,
        unsubscriptionFetchStatus: FetchStatusFlag.IDLE,
      };
    }
    case UNSUBSCRIBE_FAILURE: {
      return {
        ...state,
        unsubscriptionFetchStatus: FetchStatusFlag.FETCH_ERROR,
      };
    }
    case CANCEL_UNSUBSCRIPTION_REQUEST: {
      return {
        ...state,
        unsubscriptionCancellationFetchStatus: FetchStatusFlag.FETCHING,
      };
    }
    case CANCEL_UNSUBSCRIPTION_SUCCESS: {
      return {
        ...state,
        unsubscriptionCancellationFetchStatus: FetchStatusFlag.IDLE,
      };
    }
    case CANCEL_UNSUBSCRIPTION_FAILURE: {
      return {
        ...state,
        unsubscriptionCancellationFetchStatus: FetchStatusFlag.FETCH_ERROR,
      };
    }
    default:
      return state;
  }
}
