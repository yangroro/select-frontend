import { createReducer } from 'redux-act';

import env from "app/config/env";

export const environmentReducer = createReducer<typeof env>({}, env);
export { env as INITIAL_STATE }; // TODO: convert to reselect
