import { Action } from 'app/reducers';
import { EnvironmentState } from 'app/services/environment/reducer.state';

export const INITIALIZE_ENVIRONMENT_DATA = 'INITIALIZE_ENVIRONMENT_DATA';

export interface ActionInitializeEnvironmentData extends Action<typeof INITIALIZE_ENVIRONMENT_DATA, {
  environment: EnvironmentState,
}> {}

export type EnvironmentActionTypes = ActionInitializeEnvironmentData;

export const initializeEnvironmentData = (environment: EnvironmentState): ActionInitializeEnvironmentData => {
  return { type: INITIALIZE_ENVIRONMENT_DATA, payload: { environment } };
};
