import { DeviceType, Tracker } from '@ridi/event-tracker';
import { RidiSelectState, hasCompletedSubscription } from 'app/store';
import { LOCATION_CHANGE, replace } from 'react-router-redux';
import { all, select, take, put } from 'redux-saga/effects';
import { TRACK_CLICK, ActionTrackClick, TRACK_IMPRESSION, ActionTrackImpression } from './actions';
import { clearScrollEndHandlers } from './onWindowScrollEnd';

export const PIXEL_ID = '417351945420295';
let tracker: Tracker;

// **IMPORTANT NOTE**
// You may also need to change `tracking_macro.twig` when you change this function
const initializeTracker = (state: RidiSelectState) => {
  let deviceType: DeviceType;
  if (document.body.clientWidth < 840) {
    deviceType = DeviceType.Mobile;
  } else {
    deviceType = DeviceType.PC;
  }

  tracker = new Tracker({
    deviceType,
    userId: state.user.uId,
    tagManagerOptions: {
      trackingId: 'GTM-WLRHQ86',
    },
  });
  tracker.initialize();
};

// **IMPORTANT NOTE**
// You may also need to change `tracking_macro.twig` when you change this saga
export function* watchLocationChange() {
  let _referrer = document.referrer;
  while (true) {
    yield take(LOCATION_CHANGE);
    const state: RidiSelectState = yield select((s) => s);
    const href = window.location.href

    if (!tracker) {
      initializeTracker(state);
    }

    clearScrollEndHandlers();

    if (_referrer) {
      tracker.sendPageView(href, _referrer);
    } else {
      tracker.sendPageView(href);
    }
    _referrer = href;

    if (hasCompletedSubscription()) {
      tracker.sendEvent('New Subscription', {
        monthlyFee: 6500 // FIXME: get monthlyFee from backend
      });
      // Remove new subscription search string for tracking and move to entry page if there is one
      yield put(replace({
        ...state.router.location,
        search: state.router.location!.search.replace(/[&?]new_subscription=[^&=]+/, ''),
      }));
    }
  }
}

export function* watchTrackClick() {
  while (true) {
    const { payload: bookTrackingParams }: ActionTrackClick = yield take(TRACK_CLICK);

    if (!tracker) {
      initializeTracker(yield select((s) => s));
    }

    tracker.sendEvent('Click', bookTrackingParams);
  }
}

export function* watchTrackImpressions() {
  while (true) {
    const { payload: bookTrackingParams }: ActionTrackImpression = yield take(TRACK_IMPRESSION);

    if (!tracker) {
      initializeTracker(yield select((s) => s));
    }

    tracker.sendEvent('Impression', bookTrackingParams);
  }
}

export function* trackingSaga() {
  yield all([
    watchLocationChange(),
    watchTrackClick(),
    watchTrackImpressions(),
  ]);
}
