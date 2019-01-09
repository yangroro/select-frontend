import { Action } from 'app/reducers';
import { ReservedSelectionIds } from 'app/services/selection/reducer.state';
import { SelectionResponse } from 'app/services/selection/requests';

export const UPDATE_SELECTIONS = 'UPDATE_SELECTIONS';
export const UPDATE_HOT_RELEASE = 'UPDATE_HOT_RELEASE';
export const LOAD_SELECTION_REQUEST = 'LOAD_SELECTION_REQUEST';
export const LOAD_SELECTION_SUCCESS = 'LOAD_SELECTION_SUCCESS';
export const LOAD_SELECTION_FAILURE = 'LOAD_SELECTION_FAILURE';

export type SelectionId = number|ReservedSelectionIds;

export interface ActionUpdateSelections
  extends Action<typeof UPDATE_SELECTIONS, { selections: SelectionResponse[] }> {}
  export interface ActionUpdateHotRelease
  extends Action<typeof UPDATE_HOT_RELEASE, { hotRelease: SelectionResponse }> {}
export interface ActionLoadSelectionRequest
  extends Action<typeof LOAD_SELECTION_REQUEST, { selectionId: number|ReservedSelectionIds; page: number }> {}
export interface ActionLoadSelectionSuccess
  extends Action<
      typeof LOAD_SELECTION_SUCCESS,
      { selectionId: SelectionId; page: number; response: SelectionResponse }
    > {}
export interface ActionLoadSelectionFailure
  extends Action<typeof LOAD_SELECTION_FAILURE, { selectionId: SelectionId; page: number }> {}

export type SelectionActionTypes =
  ActionUpdateHotRelease
  | ActionUpdateSelections
  | ActionLoadSelectionRequest
  | ActionLoadSelectionSuccess
  | ActionLoadSelectionFailure;

export const updateSelections = (selections: SelectionResponse[]): ActionUpdateSelections => {
  return { type: UPDATE_SELECTIONS, payload: { selections } };
};

export const updateHotRelease = (hotRelease: SelectionResponse): ActionUpdateHotRelease => {
  return { type: UPDATE_HOT_RELEASE, payload: { hotRelease } };
};

export const loadSelectionRequest = (
  selectionId: SelectionId,
  page: number,
): ActionLoadSelectionRequest => {
  return { type: LOAD_SELECTION_REQUEST, payload: { selectionId, page } };
};

export const loadSelectionSuccess = (
  selectionId: SelectionId,
  page: number,
  response: SelectionResponse,
): ActionLoadSelectionSuccess => {
  return { type: LOAD_SELECTION_SUCCESS, payload: { selectionId, page, response } };
};

export const loadSelectionFailure = (
  selectionId: SelectionId,
  page: number,
): ActionLoadSelectionFailure => {
  return { type: LOAD_SELECTION_FAILURE, payload: { selectionId, page } };
};
