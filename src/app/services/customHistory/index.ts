import { Location } from 'history';
import { createAction, createReducer } from 'redux-act';

import { HistoryStack, updateHistoryStack } from 'app/services/customHistory/historyStack.helpers';

export * from './sagas';
export * from './components';

export const Actions = {
  syncHistoryStack: createAction<{
    location: Location,
    stack?: HistoryStack,
  }>(),
  navigateUp: createAction(),
};

export interface CustomHistoryState {
  historyStack: HistoryStack;
}

export const INITIAL_CUSTOM_HISTORY_STATE: CustomHistoryState = {
  historyStack: [],
};

export const customHistoryReducer = createReducer<typeof INITIAL_CUSTOM_HISTORY_STATE>({}, INITIAL_CUSTOM_HISTORY_STATE);

customHistoryReducer.on(Actions.syncHistoryStack, (state, action) => {
  const { stack, location } = action;
  return {
    ...state,
    historyStack: updateHistoryStack(
      stack || state.historyStack,
      location,
    ),
  };
});

customHistoryReducer.on(Actions.navigateUp, (state, action) => state);
