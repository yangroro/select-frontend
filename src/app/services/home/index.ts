import { createAction, createReducer } from 'redux-act';
import { HomeResponse } from './requests';
import { FetchStatusFlag } from 'app/constants';

export const Actions = {
  loadHomeRequest: createAction('loadHomeRequest'),
  loadHomeSuccess: createAction<{
    response: HomeResponse,
    fetchedAt: number,
  }>('loadHomeSuccess'),
  loadHomeFailure: createAction('loadHomeFailure'),
};

export enum SelectionType {
  'SELECTION' = 'SELECTION',
  'CHART' = 'CHART',
  'HOT_RELEASE' = 'HOT_RELEASE',
}

export interface BigBanner {
  id: number;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export interface HomeState {
  fetchedAt: number | null;
  fetchStatus: FetchStatusFlag;
  bigBannerList: BigBanner[];
  selectionIdList: number[];
}

export const INITIAL_HOME_STATE: HomeState = {
  fetchedAt: null,
  fetchStatus: FetchStatusFlag.IDLE,
  bigBannerList: [],
  selectionIdList: [],
};

export const homeReducer = createReducer<typeof INITIAL_HOME_STATE>({}, INITIAL_HOME_STATE);

homeReducer.on(Actions.loadHomeRequest, (state, action) => {
  return {
    ...state,
    fetchStatus: FetchStatusFlag.FETCHING,
  };
});

homeReducer.on(Actions.loadHomeSuccess, (state, action) => {
  const { response, fetchedAt } = action
  return {
    ...state,
    fetchedAt: fetchedAt,
    bigBannerList: response.bigBanners,
    selectionIdList: response.collections.map((collection) => collection.collectionId),
    fetchStatus: FetchStatusFlag.IDLE,
  };
});

homeReducer.on(Actions.loadHomeFailure, (state, action) => {
  return {
    ...state,
    fetchStatus: FetchStatusFlag.FETCH_ERROR,
  };
});
