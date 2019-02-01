import produce from 'immer';
import { createAction, createReducer } from 'redux-act';

export type errorResponseStatus = number | null;

export const Actions = {
  setState: createAction<{
    status: errorResponseStatus,
  }>('setState'),
};

export interface ServiceStatusState {
  errorResponseState: errorResponseStatus;
}

const INITIAL_SERVICE_STATUS: ServiceStatusState = {
  errorResponseState: null,
};

export const serviceStatusReducer = createReducer<ServiceStatusState>({}, INITIAL_SERVICE_STATUS);

serviceStatusReducer.on(Actions.setState, (state, { status }) => produce(state, (draftState) => {
  draftState.errorResponseState = status;
}));
