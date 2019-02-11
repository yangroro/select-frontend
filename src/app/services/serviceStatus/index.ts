import produce from 'immer';
import { createAction, createReducer } from 'redux-act';

export type errorResponseStatus = number;
export type errorResponseData = 'maintenance';

export const Actions = {
  setState: createAction<{
    status: errorResponseStatus,
    data?: {
      status: errorResponseData,
    },
  }>('setState'),
  resetState: createAction('resetState'),
};

export interface ServiceStatusState {
  errorResponseState?: errorResponseStatus;
  errorResponseData?: errorResponseData;
}

export const serviceStatusReducer = createReducer<ServiceStatusState>({}, {});

serviceStatusReducer.on(Actions.setState, (state, { status, data }) => produce(state, (draftState) => {
  draftState.errorResponseState = status;
  draftState.errorResponseData = (data && data.status) || undefined;
}));

serviceStatusReducer.on(Actions.resetState, (state) => produce(state, (draftState) => {
  draftState.errorResponseState = undefined;
  draftState.errorResponseData = undefined;
}));
