import { INITIALIZE_ENVIRONMENT_DATA, EnvironmentActionTypes } from 'app/services/environment/actions';
import { environmentInitialState, EnvironmentState } from 'app/services/environment/reducer.state';

export const environmentReducer = (
  state = environmentInitialState,
  action: EnvironmentActionTypes,
): EnvironmentState => {
  switch (action.type) {
    case INITIALIZE_ENVIRONMENT_DATA: {
      return {
        ...state,
        ...action.payload!.environment,
      };
    }
    default:
      return state;
  }
};
