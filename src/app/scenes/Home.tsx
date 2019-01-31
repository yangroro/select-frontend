import * as differenceInHours from 'date-fns/difference_in_hours';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { forceCheck } from 'react-lazyload';
import { connect } from 'react-redux';

import { FetchStatusFlag } from 'app/constants';
import { BookState } from 'app/services/book';
import { Actions } from 'app/services/home';
import { ConnectedBigBannerCarousel } from 'app/services/home/components/BigBanner';
import { ConnectedHomeSectionList } from 'app/services/home/components/HomeSectionList';
import { Actions as SelectionActions, SelectionId, SelectionsState } from 'app/services/selection';
import { RidiSelectState } from 'app/store';

interface HomeStateProps {
  fetchStatus: FetchStatusFlag;
  fetchedAt: number | null;
  selectionIdList: number[];
  books: BookState;
  selections: SelectionsState;
}
interface State {
  isInitialized: boolean;
}

export class Home extends React.PureComponent<HomeStateProps & ReturnType<typeof mapDispatchToProps>, State> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    isInitialized: false,
  };

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      const {
        fetchedAt,
        dispatchLoadHomeRequest,
        dispatchLoadSelectionRequest,
      } = this.props;
      if (
        !fetchedAt ||
        Math.abs(differenceInHours(fetchedAt, Date.now())) >= 3
      ) {
        dispatchLoadHomeRequest();
        dispatchLoadSelectionRequest('hotRelease');
      }
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
      forceCheck();
    });
  }

  public componentWillUnmount() {
    if (this.initialDispatchTimeout) {
      window.clearTimeout(this.initialDispatchTimeout);
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    }
  }

  public render() {
    return (
      <main className="SceneWrapper PageHome">
        <Helmet title="리디셀렉트" />
        <div className="a11y"><h1>리디셀렉트 홈</h1></div>
        <ConnectedBigBannerCarousel />
        <ConnectedHomeSectionList />
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): HomeStateProps => {
  return {
    fetchStatus: state.home.fetchStatus,
    fetchedAt: state.home.fetchedAt,
    selectionIdList: state.home.selectionIdList,
    selections: state.selectionsById,
    books: state.booksById,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadHomeRequest: () => dispatch(Actions.loadHomeRequest()),
    dispatchLoadSelectionRequest: (selectionId: SelectionId) => dispatch(SelectionActions.loadSelectionRequest({ selectionId, page: 1 })),
  };
};

export const ConnectedHome = connect(mapStateToProps, mapDispatchToProps)(Home);
