import * as classNames from 'classnames';
import * as differenceInHours from 'date-fns/difference_in_hours';
import * as React from 'react';
import { forceCheck } from 'react-lazyload';
import { connect } from 'react-redux';

import { HelmetWithTitle } from 'app/components';
import { FetchStatusFlag, PageTitleText } from 'app/constants';
import { BookState } from 'app/services/book';
import { Actions as CollectionActions, CollectionId, CollectionsState } from 'app/services/collection';
import { Actions } from 'app/services/home';
import { ConnectedBigBannerCarousel } from 'app/services/home/components/BigBanner';
import { ConnectedHomeSectionList } from 'app/services/home/components/HomeSectionList';
import { RidiSelectState } from 'app/store';

interface HomeStateProps {
  fetchStatus: FetchStatusFlag;
  fetchedAt: number | null;
  collectionIdList: number[];
  books: BookState;
  collections: CollectionsState;
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
        dispatchLoadCollectionRequest,
      } = this.props;
      if (window.inApp && window.inApp.initialRendered) {
        window.inApp.initialRendered();
      }
      if (
        !fetchedAt ||
        Math.abs(differenceInHours(fetchedAt, Date.now())) >= 3
      ) {
        dispatchLoadHomeRequest();
        dispatchLoadCollectionRequest('spotlight');
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
      <main
        className={classNames(
          'PageHome',
          'SceneWrapper',
          'SceneWrapper_WithGNB',
          'SceneWrapper_WithLNB',
        )}
      >
        <HelmetWithTitle titleName={PageTitleText.HOME} />
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
    collectionIdList: state.home.collectionIdList,
    collections: state.collectionsById,
    books: state.booksById,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadHomeRequest: () => dispatch(Actions.loadHomeRequest()),
    dispatchLoadCollectionRequest: (collectionId: CollectionId) => dispatch(CollectionActions.loadCollectionRequest({ collectionId, page: 1 })),
  };
};

export const ConnectedHome = connect(mapStateToProps, mapDispatchToProps)(Home);
