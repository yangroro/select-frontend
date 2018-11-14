import { Action } from 'app/reducers';
import { MySelectHistoryResponse, PurchasesResponse, SubscriptionResponse } from 'app/services/user/requests';
import { RidiSelectUserDTO } from '../../../types';

export const INITIALIZE_USER = 'INITIALIZE_USER';
export const LOAD_SUBSCRIPTION_REQUEST = 'LOAD_SUBSCRIPTION_REQUEST';
export const LOAD_SUBSCRIPTION_SUCCESS = 'LOAD_SUBSCRIPTION_SUCCESS';
export const LOAD_SUBSCRIPTION_FAILURE = 'LOAD_SUBSCRIPTION_FAILURE';
export const CLEAR_PURCHASES = 'CLEAR_PURCHASES';
export const LOAD_PURCHASES_REQUEST = 'LOAD_PURCHASES_REQUEST';
export const LOAD_PURCHASES_SUCCESS = 'LOAD_PURCHASES_SUCCESS';
export const LOAD_PURCHASES_FAILURE = 'LOAD_PURCHASES_FAILURE';
export const CANCEL_PURCHASE_REQUEST = 'CANCEL_PURCHASE_REQUEST';
export const CANCEL_PURCHASE_SUCCESS = 'CANCEL_PURCHASE_SUCCESS';
export const CANCEL_PURCHASE_FAILURE = 'CANCEL_PURCHASE_FAILURE';
export const LOAD_MY_SELECT_HISTORY_REQUEST = 'LOAD_MY_SELECT_HISTORY_REQUEST';
export const LOAD_MY_SELECT_HISTORY_SUCCESS = 'LOAD_MY_SELECT_HISTORY_SUCCESS';
export const LOAD_MY_SELECT_HISTORY_FAILURE = 'LOAD_MY_SELECT_HISTORY_FAILURE';
export const DELETE_MY_SELECT_HISTORY_REQUEST = 'DELETE_MY_SELECT_HISTORY_REQUEST';
export const DELETE_MY_SELECT_HISTORY_SUCCESS = 'DELETE_MY_SELECT_HISTORY_SUCCESS';
export const DELETE_MY_SELECT_HISTORY_FAILURE = 'DELETE_MY_SELECT_HISTORY_FAILURE';
export const UNSUBSCRIBE_REQUEST = 'UNSUBSCRIBE_REQUEST';
export const UNSUBSCRIBE_SUCCESS = 'UNSUBSCRIBE_SUCCESS';
export const UNSUBSCRIBE_FAILURE = 'UNSUBSCRIBE_FAILURE';
export const CANCEL_UNSUBSCRIPTION_REQUEST = 'CANCEL_UNSUBSCRIPTION_REQUEST';
export const CANCEL_UNSUBSCRIPTION_SUCCESS = 'CANCEL_UNSUBSCRIPTION_SUCCESS';
export const CANCEL_UNSUBSCRIPTION_FAILURE = 'CANCEL_UNSUBSCRIPTION_FAILURE';
export const CLEAR_MY_SELECT_HISTORY = 'CLEAR_MY_SELECT_HISTORY';

export interface ActionInitializeUser extends Action<typeof INITIALIZE_USER, RidiSelectUserDTO> {}

export interface ActionLoadSubscriptionRequest extends Action<typeof LOAD_SUBSCRIPTION_REQUEST> {}
export interface ActionLoadSubscriptionSuccess extends Action<typeof LOAD_SUBSCRIPTION_SUCCESS, SubscriptionResponse> {}
export interface ActionLoadSubscriptionFailure extends Action<typeof LOAD_SUBSCRIPTION_FAILURE> {}

export interface ActionClearPurchases extends Action<typeof CLEAR_PURCHASES> {}
export interface ActionLoadPurchasesRequest extends Action<typeof LOAD_PURCHASES_REQUEST, { page: number }> {}
export interface ActionLoadPurchasesSuccess
  extends Action<
    typeof LOAD_PURCHASES_SUCCESS,
    { page: number, response: PurchasesResponse }
  > {}
export interface ActionLoadPurchasesFailure extends Action<typeof LOAD_PURCHASES_FAILURE, { page: number }> {}

export interface ActionCancelPurchaseRequest extends Action<typeof CANCEL_PURCHASE_REQUEST, { purchaseId: number }> {}
export interface ActionCancelPurchaseSuccess extends Action<typeof CANCEL_PURCHASE_SUCCESS, { purchaseId: number }> {}
export interface ActionCancelPurchaseFailure extends Action<typeof CANCEL_PURCHASE_FAILURE, { purchaseId: number }> {}

export interface ActionLoadMySelectHistoryRequest
  extends Action<typeof LOAD_MY_SELECT_HISTORY_REQUEST, { page: number }> {}
export interface ActionLoadMySelectHistorySuccess
  extends Action<
      typeof LOAD_MY_SELECT_HISTORY_SUCCESS,
      { page: number; response: MySelectHistoryResponse; }
    > {}
export interface ActionLoadMySelectHistoryFailure
  extends Action<typeof LOAD_MY_SELECT_HISTORY_FAILURE, { page: number }> {}
export interface ActionClearMySelectHistory
  extends Action<typeof CLEAR_MY_SELECT_HISTORY> {}

export interface ActionDeleteMySelectHistoryRequest
  extends Action<typeof DELETE_MY_SELECT_HISTORY_REQUEST, { mySelectBookIds: number[], page: number }> {}
export interface ActionDeleteMySelectHistorySuccess
  extends Action<typeof DELETE_MY_SELECT_HISTORY_SUCCESS, { page:number; response: MySelectHistoryResponse; }> {}
export interface ActionDeleteMySelectHistoryFailure extends Action<typeof DELETE_MY_SELECT_HISTORY_FAILURE> {}

export interface ActionUnsubscribeRequest extends Action<typeof UNSUBSCRIBE_REQUEST> {}
export interface ActionUnsubscribeSuccess extends Action<typeof UNSUBSCRIBE_SUCCESS> {}
export interface ActionUnsubscribeFailure extends Action<typeof UNSUBSCRIBE_FAILURE> {}

export interface ActionCancelUnsubscriptionRequest extends Action<typeof CANCEL_UNSUBSCRIPTION_REQUEST> {}
export interface ActionCancelUnsubscriptionSuccess extends Action<typeof CANCEL_UNSUBSCRIPTION_SUCCESS> {}
export interface ActionCancelUnsubscriptionFailure extends Action<typeof CANCEL_UNSUBSCRIPTION_FAILURE> {}

export type UserActionTypes =
  ActionInitializeUser |
  ActionLoadSubscriptionRequest |
  ActionLoadSubscriptionSuccess |
  ActionLoadSubscriptionFailure |
  ActionLoadPurchasesRequest |
  ActionLoadPurchasesSuccess |
  ActionLoadPurchasesFailure |
  ActionClearPurchases |
  ActionCancelPurchaseRequest |
  ActionCancelPurchaseSuccess |
  ActionCancelPurchaseFailure |
  ActionLoadMySelectHistoryRequest |
  ActionLoadMySelectHistorySuccess |
  ActionLoadMySelectHistoryFailure |
  ActionDeleteMySelectHistoryRequest |
  ActionDeleteMySelectHistorySuccess |
  ActionDeleteMySelectHistoryFailure |
  ActionUnsubscribeRequest |
  ActionUnsubscribeSuccess |
  ActionUnsubscribeFailure |
  ActionCancelUnsubscriptionRequest |
  ActionCancelUnsubscriptionSuccess |
  ActionCancelUnsubscriptionFailure |
  ActionClearMySelectHistory;

export const initializeUser = (usderDTO: RidiSelectUserDTO): ActionInitializeUser => {
  return { type: INITIALIZE_USER, payload: { ...usderDTO } };
};

export const loadSubscriptionRequest = (): ActionLoadSubscriptionRequest => {
  return { type: LOAD_SUBSCRIPTION_REQUEST };
};

export const loadSubscriptionSuccess = (response: SubscriptionResponse): ActionLoadSubscriptionSuccess => {
  return { type: LOAD_SUBSCRIPTION_SUCCESS, payload: response };
};

export const loadSubscriptionFailure = (): ActionLoadSubscriptionFailure => {
  return { type: LOAD_SUBSCRIPTION_FAILURE };
};

export const clearPurchases = (): ActionClearPurchases => {
  return { type: CLEAR_PURCHASES };
};

export const loadPurchasesRequest = (page: number): ActionLoadPurchasesRequest => {
  return { type: LOAD_PURCHASES_REQUEST, payload: { page } };
};

export const loadPurchasesSuccess = (page: number, response: PurchasesResponse): ActionLoadPurchasesSuccess => {
  return { type: LOAD_PURCHASES_SUCCESS, payload: { page, response } };
};

export const loadPurchasesFailure = (page: number): ActionLoadPurchasesFailure => {
  return { type: LOAD_PURCHASES_FAILURE, payload: { page } };
};

export const cancelPurchaseRequest = (purchaseId: number): ActionCancelPurchaseRequest => {
  return { type: CANCEL_PURCHASE_REQUEST, payload: { purchaseId } };
};

export const cancelPurchaseSuccess = (purchaseId: number): ActionCancelPurchaseSuccess => {
  return { type: CANCEL_PURCHASE_SUCCESS, payload: { purchaseId } };
};

export const cancelPurchaseFailure = (purchaseId: number): ActionCancelPurchaseFailure => {
  return { type: CANCEL_PURCHASE_FAILURE, payload: { purchaseId } };
};

export const loadMySelectHistoryRequest = (
  page: number,
): ActionLoadMySelectHistoryRequest => {
  return { type: LOAD_MY_SELECT_HISTORY_REQUEST, payload: { page } };
};

export const loadMySelectHistorySuccess = (
  page: number,
  response: MySelectHistoryResponse,
): ActionLoadMySelectHistorySuccess => {
  return { type: LOAD_MY_SELECT_HISTORY_SUCCESS, payload: { page, response } };
};

export const loadMySelectHistoryFailure = (
  page: number,
): ActionLoadMySelectHistoryFailure => {
  return { type: LOAD_MY_SELECT_HISTORY_FAILURE, payload: { page } };
};

export const clearMySelectHistory = (): ActionClearMySelectHistory => {
  return { type: CLEAR_MY_SELECT_HISTORY };
};

export const deleteMySelectHistoryRequest = (mySelectBookIds: number[], page: number): ActionDeleteMySelectHistoryRequest => {
  return { type: DELETE_MY_SELECT_HISTORY_REQUEST, payload: { mySelectBookIds, page } };
};

export const deleteMySelectHistorySuccess = (page: number, response: MySelectHistoryResponse): ActionDeleteMySelectHistorySuccess => {
  return { type: DELETE_MY_SELECT_HISTORY_SUCCESS, payload: { page, response } };
};

export const deleteMySelectHistoryFailure = (): ActionDeleteMySelectHistoryFailure => {
  return { type: DELETE_MY_SELECT_HISTORY_FAILURE };
};

export const unsubscribeRequest = (): ActionUnsubscribeRequest => {
  return { type: UNSUBSCRIBE_REQUEST };
}
export const unsubscribeSuccess = (): ActionUnsubscribeSuccess => {
  return { type: UNSUBSCRIBE_SUCCESS };
}
export const unsubscribeFailure = (): ActionUnsubscribeFailure => {
  return { type: UNSUBSCRIBE_FAILURE };
}

export const cancelUnsubscriptionRequest = (): ActionCancelUnsubscriptionRequest => {
  return { type: CANCEL_UNSUBSCRIPTION_REQUEST };
}
export const cancelUnsubscriptionSuccess = (): ActionCancelUnsubscriptionSuccess => {
  return { type: CANCEL_UNSUBSCRIPTION_SUCCESS };
}
export const cancelUnsubscriptionFailure = (): ActionCancelUnsubscriptionFailure => {
  return { type: CANCEL_UNSUBSCRIPTION_FAILURE };
}
