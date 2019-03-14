import history from 'app/config/history';
import { Book } from 'app/services/book';
import { requestBooks } from 'app/services/book/requests';
import { Actions as MySelectActions } from 'app/services/mySelect';
import { Actions } from 'app/services/user';
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
import { buildOnlyDateFormat } from 'app/utils/formatDate';
import toast from 'app/utils/toast';
import showMessageForRequestError from 'app/utils/toastHelper';
import { keyBy } from 'lodash-es';
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';

export function* watchLoadSubscription() {
  while (true) {
    yield take(Actions.loadSubscriptionRequest.getType());
    try {
      const response: SubscriptionResponse = yield call(requestSubscription);
      yield put(Actions.loadSubscriptionSuccess({ response }));
    } catch (e) {
      yield put(Actions.loadSubscriptionFailure());
      showMessageForRequestError(e);
    }
  }
}

export function* watchLoadPurchases() {
  while (true) {
    const { payload: { page } }: ReturnType<typeof Actions.loadPurchasesRequest> = yield take(Actions.loadPurchasesRequest.getType());
    try {
      const response: PurchasesResponse = yield call(requestPurchases, page);
      yield put(Actions.loadPurchasesSuccess({ page, response }));
    } catch (e) {
      yield put(Actions.loadPurchasesFailure({ page }));
      showMessageForRequestError(e);
    }
  }
}

export function* loadMySelectHistory({ payload }: ReturnType<typeof Actions.loadMySelectHistoryRequest>) {
  const { page } = payload!;
  try {
    const response: MySelectHistoryResponse = yield call(reqeustMySelectHistory, page);
    if (response.userRidiSelectBooks.length > 0) {
      const books: Book[] = yield call(requestBooks, response.userRidiSelectBooks.map((book) => parseInt(book.bId, 10)));
      const booksMap = keyBy(books, 'id');
      response.userRidiSelectBooks.forEach((book, index) => {
        response.userRidiSelectBooks[index].book = booksMap[book.bId];
      });
    }

    yield put(Actions.loadMySelectHistorySuccess({ page, response }));
  } catch (e) {
    yield put(Actions.loadMySelectHistoryFailure({ page }));
    showMessageForRequestError(e);
  }
}

export function* watchLoadMySelectHistory() {
  yield takeEvery(Actions.loadMySelectHistoryRequest.getType(), loadMySelectHistory);
}

export function* watchDeleteMySelectHistory() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.deleteMySelectHistoryRequest> = yield take(
      Actions.deleteMySelectHistoryRequest.getType(),
    );
    const { mySelectBookIds, page } = payload!;
    try {
      yield call(reqeustDeleteMySelectHistory, mySelectBookIds);
      const response: MySelectHistoryResponse = yield call(reqeustMySelectHistory, page);
      if (response.userRidiSelectBooks.length > 0) {
        const books: Book[] = yield call(requestBooks, response.userRidiSelectBooks.map((book) => parseInt(book.bId, 10)));
        const booksMap = keyBy(books, 'id');
        response.userRidiSelectBooks.forEach((book, index) => {
          response.userRidiSelectBooks[index].book = booksMap[book.bId];
        });
      }

      yield put(Actions.deleteMySelectHistorySuccess({ page, response }));
      if (response.userRidiSelectBooks.length === 0 && page > 1) {
        history.replace(`/my-select-history?page=${page - 1}`);
      }
    } catch (e) {
      yield put(MySelectActions.deleteMySelectFailure());
      showMessageForRequestError(e);
    }
  }
}

export function* watchCancelPurchase() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.cancelPurchaseRequest> = yield take(
      Actions.cancelPurchaseRequest.getType(),
    );
    const { purchaseId } = payload!;
    try {
      yield call(requestCancelPurchase, purchaseId);
      yield put(Actions.cancelPurchaseSuccess({ purchaseId }));
      alert('결제가 취소되었습니다.');
      window.location.href = '/';
    } catch (e) {
      toast.failureMessage(e.data.message);
      yield put(Actions.cancelPurchaseFailure({ purchaseId }));
    }
  }
}

export function* watchUnsubscribe() {
  while (true) {
    yield take(Actions.unsubscribeRequest.getType());
    const state: RidiSelectState = yield select((s) => s);
    try {
      yield call(requestUnsubscribe, state.user.subscription!.subscriptionId);
      yield put(Actions.unsubscribeSuccess());
      yield put(Actions.loadSubscriptionRequest());
      const endDate = buildOnlyDateFormat(state.user.subscription!.ticketEndDate);
      alert(`구독 해지가 예약되었습니다.\n${endDate}까지 이용할 수 있습니다.`);
      history.replace('/settings');
    } catch (e) {
      yield put(Actions.unsubscribeFailure());
      showMessageForRequestError(e);
    }
  }
}
export function* watchCancelUnsubscription() {
  while (true) {
    yield take(Actions.cancelUnsubscriptionRequest.getType());
    const state: RidiSelectState = yield select((s) => s);
    try {
      yield call(requestCancelUnsubscription, state.user.subscription!.subscriptionId);
      yield put(Actions.cancelUnsubscriptionSuccess());
      yield put(Actions.loadSubscriptionRequest());
      alert('구독 해지 예약이 취소되었습니다.');
    } catch (e) {
      yield put(Actions.cancelUnsubscriptionFailure());
      if (e.response && e.response.data.code === 'DELETED_PAYMENT_METHOD') {
        toast.failureMessage(e.response.data.message);
      } else {
        showMessageForRequestError(e);
      }
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
