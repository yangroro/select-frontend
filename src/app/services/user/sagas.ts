import { deleteMySelectFailure } from 'app/services/mySelect/actions';
import {
  ActionCancelPurchaseRequest,
  ActionDeleteMySelectHistoryRequest,
  ActionLoadMySelectHistoryRequest,
  ActionLoadPurchasesRequest,
  CANCEL_PURCHASE_REQUEST,
  CANCEL_UNSUBSCRIPTION_REQUEST,
  cancelPurchaseFailure,
  cancelPurchaseSuccess,
  cancelUnsubscriptionFailure,
  cancelUnsubscriptionSuccess,
  DELETE_MY_SELECT_HISTORY_REQUEST,
  deleteMySelectHistorySuccess,
  LOAD_MY_SELECT_HISTORY_REQUEST,
  LOAD_PURCHASES_REQUEST,
  LOAD_SUBSCRIPTION_REQUEST,
  loadMySelectHistoryFailure,
  loadMySelectHistorySuccess,
  loadPurchasesFailure,
  loadPurchasesSuccess,
  loadSubscriptionFailure,
  loadSubscriptionRequest,
  loadSubscriptionSuccess,
  UNSUBSCRIBE_REQUEST,
  unsubscribeFailure,
  unsubscribeSuccess,
} from 'app/services/user/actions';
import {
  MySelectHistoryResponse,
  PurchasesResponse,
  reqeustDeleteMySelectHistory,
  reqeustMySelectHistory,
  requestCancelPurchase,
  requestCancelUnsubscription,
  requestPurchases,
  requestSubscription,
  requestUnsubscribe,
  SubscriptionResponse,
} from 'app/services/user/requests';
import { RidiSelectState } from 'app/store';
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';
import history from 'app/config/history';
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import toast from 'app/utils/toast';
import { Book } from "app/services/book";
import { requestBooks } from "app/services/book/requests";
import { keyBy } from "lodash-es";
import showMessageForRequestError from "app/utils/toastHelper";

export function* watchLoadSubscription() {
  while (true) {
    yield take(LOAD_SUBSCRIPTION_REQUEST);
    try {
      const response: SubscriptionResponse = yield call(requestSubscription);
      yield put(loadSubscriptionSuccess(response));
    } catch (e) {
      yield put(loadSubscriptionFailure());
      showMessageForRequestError(e);
    }
  }
}

export function* watchLoadPurchases() {
  while (true) {
    const { payload }: ActionLoadPurchasesRequest = yield take(LOAD_PURCHASES_REQUEST);
    const { page } = payload!;
    try {
      let response: PurchasesResponse = yield call(requestPurchases, page);
      yield put(loadPurchasesSuccess(page, response));
    } catch (e) {
      yield put(loadPurchasesFailure(page));
      showMessageForRequestError(e);
    }
  }
}

export function* loadMySelectHistory({ payload }: ActionLoadMySelectHistoryRequest) {
  const { page } = payload!;
  try {
    let response: MySelectHistoryResponse = yield call(reqeustMySelectHistory, page);
    if (response.userRidiSelectBooks.length > 0) {
      const books: Book[] = yield call(requestBooks, response.userRidiSelectBooks.map(book => parseInt(book.bId)));
      const books_map = keyBy(books, 'id');
      response.userRidiSelectBooks.forEach((book, index) => {
        response.userRidiSelectBooks[index].book = books_map[book.bId];
      });
    }

    yield put(loadMySelectHistorySuccess(page, response));
  } catch (e) {
    yield put(loadMySelectHistoryFailure(page));
    showMessageForRequestError(e);
  }
}

export function* watchLoadMySelectHistory() {
  yield takeEvery(LOAD_MY_SELECT_HISTORY_REQUEST, loadMySelectHistory);
}

export function* watchDeleteMySelectHistory() {
  while (true) {
    const { payload }: ActionDeleteMySelectHistoryRequest = yield take(
      DELETE_MY_SELECT_HISTORY_REQUEST,
    );
    const { mySelectBookIds, page } = payload!;
    try {
      yield call(reqeustDeleteMySelectHistory, mySelectBookIds);
      let response: MySelectHistoryResponse = yield call(reqeustMySelectHistory, page);
      if (response.userRidiSelectBooks.length > 0) {
        const books: Book[] = yield call(requestBooks, response.userRidiSelectBooks.map(book => parseInt(book.bId)));
        const books_map = keyBy(books, 'id');
        response.userRidiSelectBooks.forEach((book, index) => {
          response.userRidiSelectBooks[index].book = books_map[book.bId];
        });
      }

      yield put(deleteMySelectHistorySuccess(page, response));
      if (response.userRidiSelectBooks.length === 0 && page > 1) {
        history.replace(`/my-select-history?page=${page - 1}`);
      }
    } catch (e) {
      yield put(deleteMySelectFailure());
      showMessageForRequestError(e);
    }
  }
}

export function* watchCancelPurchase() {
  while (true) {
    const { payload }: ActionCancelPurchaseRequest = yield take(
      CANCEL_PURCHASE_REQUEST,
    );
    const { purchaseId } = payload!;
    try {
      yield call(requestCancelPurchase, purchaseId);
      yield put(cancelPurchaseSuccess(purchaseId));
      alert('결제가 취소되었습니다.');
      window.location.href = '/';
    } catch (e) {
      toast.fail(e.data.message);
      yield put(cancelPurchaseFailure(purchaseId));
    }
  }
}

export function* watchUnsubscribe() {
  while (true) {
    yield take(UNSUBSCRIBE_REQUEST);
    const state: RidiSelectState = yield select((s) => s);
    try {
      yield call(requestUnsubscribe, state.user.subscription!.subscriptionId);
      yield put(unsubscribeSuccess());
      yield put(loadSubscriptionRequest());
      const endDate = buildOnlyDateFormat(state.user.subscription!.ticketEndDate);
      alert(`구독 해지가 예약되었습니다.\n${endDate}까지 이용할 수 있습니다.`);
      history.replace('/settings');
    } catch (e) {
      yield put(unsubscribeFailure());
      showMessageForRequestError(e);
    }
  }
}
export function* watchCancelUnsubscription() {
  while (true) {
    yield take(CANCEL_UNSUBSCRIPTION_REQUEST);
    const state: RidiSelectState = yield select((s) => s);
    try {
      yield call(requestCancelUnsubscription, state.user.subscription!.subscriptionId);
      yield put(cancelUnsubscriptionSuccess());
      yield put(loadSubscriptionRequest());
      alert('구독 해지 예약이 취소되었습니다.');
    } catch (e) {
      yield put(cancelUnsubscriptionFailure());
      showMessageForRequestError(e);
    }
  }
}


export function* userRootSaga() {
  yield all([
    watchLoadSubscription(),
    watchLoadPurchases(),
    watchLoadMySelectHistory(),
    watchDeleteMySelectHistory(),
    watchCancelPurchase(),
    watchUnsubscribe(),
    watchCancelUnsubscription(),
  ]);
}
