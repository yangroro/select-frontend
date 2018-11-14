import { initialCustomHistoryState, CustomHistoryState } from "app/services/customHistory/reducer.state";
import { CustomHistoryActionTypes, SYNC_HISTORY_STACK } from "app/services/customHistory/actions";
import { updateHistoryStack } from "./historyStack.helpers";

export function customHistoryReducer(state = initialCustomHistoryState, action: CustomHistoryActionTypes): CustomHistoryState {
  switch (action.type) {
    case SYNC_HISTORY_STACK:
      return {
        ...state,
        historyStack: updateHistoryStack(
          action.payload!.stack || state.historyStack,
          action.payload!.location,
        ),
      };
    default:
      return state;
  }
}
