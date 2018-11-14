import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { forceCheck } from 'react-lazyload';
import * as differenceInHours from 'date-fns/difference_in_hours'

import { ConnectedLNB } from 'app/components';
import { FetchStatusFlag } from 'app/constants';
import { BookState } from 'app/services/book';
import { BigBanner } from 'app/services/home';
import { ActionLoadHomeRequest, loadHomeRequest } from 'app/services/home/actions';
import { ConnectedBigBannerCarousel } from 'app/services/home/components/BigBanner';
import { ConnectedHomeSection } from 'app/services/home/components/HomeSection';
import { SelectionsState } from 'app/services/selection';
import { RidiSelectState } from 'app/store';
import { HomePlaceholder } from 'app/placeholder/HomePlaceholder';
import { groupSelections } from 'app/services/home/uitls';

interface HomeDispatchProps {
  dispatchLoadHomeRequest: () => ActionLoadHomeRequest;
}

interface HomeStateProps {
  fetchStatus: FetchStatusFlag;
  fetchedAt: number | null;
  selectionIdList: number[];
  bigBannerList: BigBanner[];
  books: BookState;
  selections: SelectionsState;
}
interface State {
  isInitialized: boolean;
}

export class Home extends React.PureComponent<HomeDispatchProps & HomeStateProps, State> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    isInitialized: false,
  };

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      if (
        !this.props.fetchedAt ||
        Math.abs(differenceInHours(this.props.fetchedAt, Date.now())) >= 3
      ) {
        this.props.dispatchLoadHomeRequest();
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
    const {
      selectionIdList,
      selections,
      books,
      fetchedAt,
      bigBannerList,
    } = this.props;
    return (
      <main className='SceneWrapper PageHome'>
        <Helmet>
          <title>리디셀렉트</title>
        </Helmet>
        <div className="a11y"><h1>리디셀렉트 홈</h1></div>
        {(
          !fetchedAt ||
          !this.state.isInitialized
        ) ? (
          <HomePlaceholder />
        ) : (
          <>
            <ConnectedBigBannerCarousel
              items={bigBannerList}
            />
            <div className="PageHome_Content">
              {selectionIdList
                .map((selectionId) => selections[selectionId])
                .reduce(groupSelections, [])
                .map((selectionGroup, idx) => (
                  <div className="PageHome_Panel" key={idx}>
                    {selectionGroup.map((selection) => (
                      // TODO: Feel like it's error-prone...
                      <ConnectedHomeSection
                        key={selection.id}
                        selectionId={selection.id}
                        title={selection.title!}
                        type={selection.type!}
                        books={selection.itemListByPage[1].itemList.map((bookId: number) => books[bookId].book!)}
                      />
                    ))}
                  </div>
                ))
              }
            </div>
          </>
        )}
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
    bigBannerList: state.home.bigBannerList,
  };
};

const mapDispatchToProps = (dispatch: any): HomeDispatchProps => {
  return {
    dispatchLoadHomeRequest: () => dispatch(loadHomeRequest()),
  };
};

export const ConnectedHome = connect(mapStateToProps, mapDispatchToProps)(Home);
