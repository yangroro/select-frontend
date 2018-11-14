import { FetchStatusFlag } from 'app/constants';

export enum SelectionType {
  'SELECTION' = 'SELECTION',
  'CHART' = 'CHART',
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

export const homeInitialState: HomeState = {
  fetchedAt: null,
  fetchStatus: FetchStatusFlag.IDLE,
  bigBannerList: [],
  selectionIdList: [],
};
