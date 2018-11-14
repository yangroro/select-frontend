import { FetchStatusFlag } from 'app/constants';
import { homeInitialState, HomeState } from 'app/services/home';
import { HomeActionTypes, LOAD_HOME_FAILURE, LOAD_HOME_REQUEST, LOAD_HOME_SUCCESS } from 'app/services/home/actions';

export const homeReducer = (state = homeInitialState, action: HomeActionTypes): HomeState => {
  switch (action.type) {
    case LOAD_HOME_REQUEST:
      return {
        ...state,
        fetchStatus: FetchStatusFlag.FETCHING,
      };
    case LOAD_HOME_SUCCESS: {
      const { response, fetchedAt } = action.payload!
      return {
        ...state,
        fetchedAt: fetchedAt,
        bigBannerList: response.bigBanners,
        selectionIdList: response.selections.map((selection) => selection.selectionId),
        fetchStatus: FetchStatusFlag.IDLE,
      };
    }
    case LOAD_HOME_FAILURE:
      return {
        ...state,
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
      };
    default:
      return state;
  }
};
