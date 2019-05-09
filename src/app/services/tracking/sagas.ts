import { DeviceType, Tracker } from '@ridi/event-tracker';
import { Actions } from 'app/services/tracking';
import { hasCompletedPayletterSubscription, hasCompletedRidiPaySubscription, RidiSelectState } from 'app/store';
import { clearScrollEndHandlers } from 'app/utils/onWindowScrollEnd';
import { LOCATION_CHANGE, replace } from 'react-router-redux';
import { all, put, select, take } from 'redux-saga/effects';

import env from 'app/config/env';

export const PIXEL_ID = '417351945420295';
let tracker: Tracker;

const initializeTracker = (state: RidiSelectState) => {
  let deviceType: DeviceType;
  if (document.body.clientWidth < 840) {
    deviceType = DeviceType.Mobile;
  } else {
    deviceType = DeviceType.PC;
  }

  tracker = new Tracker({
    debug: !env.production,
    deviceType,
    userId: state.user.uId,
    tagManagerOptions: {
      trackingId: 'GTM-WLRHQ86',
    },
  });
  tracker.initialize();
};

export function* watchLocationChange() {
  let { referrer } = document;
  while (true) {
    yield take(LOCATION_CHANGE);
    const state: RidiSelectState = yield select((s) => s);
    const href = window.location.href;

    if (!tracker) {
      initializeTracker(state);
    }

    clearScrollEndHandlers();

    if (referrer) {
      tracker.sendPageView(href, referrer);
    } else {
      tracker.sendPageView(href);
    }
    referrer = href;

    const isCompletedThroughRidiPay = hasCompletedRidiPaySubscription();
    const isCompletedThroughPayletter = hasCompletedPayletterSubscription();
    if (isCompletedThroughRidiPay || isCompletedThroughPayletter) {
      tracker.sendEvent('New Subscription', {
        method: isCompletedThroughPayletter ? 'payletter' : 'ridipay',
      });
      // Remove new subscription search string for tracking and move to entry page if there is one
      yield put(replace({
        ...state.router.location,
        search: state.router.location!.search.replace(/[&?](new_subscription|new_payletter_subscription)=[^&=]+/, ''),
      }));
    }
  }
}

export function* watchTrackClick() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.trackClick> = yield take(Actions.trackClick.getType());

    if (!tracker) {
      initializeTracker(yield select((s) => s));
    }

    tracker.sendEvent('Click', payload.trackingParams);
  }
}

export function* watchTrackImpressions() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.trackImpression> = yield take(Actions.trackImpression.getType());

    if (!tracker) {
      initializeTracker(yield select((s) => s));
    }

    tracker.sendEvent('Impression', payload.trackingParams);
  }
}

export function* watchTrackMySelectAdded() {
  while (true) {
    const { payload: { trackingParams } }: ReturnType<typeof Actions.trackMySelectAdded> = yield take(Actions.trackMySelectAdded.getType());

    if (!tracker) {
      initializeTracker(yield select((s) => s));
    }

    tracker.sendEvent(trackingParams.eventName, { b_id: trackingParams.b_id });
  }
}

export function* trackingSaga() {
  yield all([
    watchLocationChange(),
    watchTrackClick(),
    watchTrackImpressions(),
    watchTrackMySelectAdded(),
  ]);
}
