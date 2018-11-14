import { Action } from "app/reducers";
import { Location } from "history";
import { HistoryStack } from "./historyStack.helpers";

export const INITIALIZE_HISTORY_STACK = 'INITIALIZE_HISTORY_STACK';
export const SYNC_HISTORY_STACK = 'SYNC_HISTORY_STACK';
export const NAVIGATE_UP = 'NAVIGATE_UP';

export type ActionSyncHistoryStack = Action<typeof SYNC_HISTORY_STACK, { location: Location, stack?: HistoryStack }>;
export type ActionNavigateUp = Action<typeof NAVIGATE_UP>;

export type CustomHistoryActionTypes =
  | ActionSyncHistoryStack
  | ActionNavigateUp;

export const syncHistoryStack = (location: Location, stack?: HistoryStack): ActionSyncHistoryStack => ({
  type: SYNC_HISTORY_STACK,
  payload: { location, stack }
});

export const navigateUp = (): ActionNavigateUp => ({
  type: NAVIGATE_UP,
});
