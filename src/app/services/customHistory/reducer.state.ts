import { HistoryStack } from "./historyStack.helpers";

export interface CustomHistoryState {
  historyStack: HistoryStack;
}

export const initialCustomHistoryState: CustomHistoryState= {
  historyStack: [],
}
