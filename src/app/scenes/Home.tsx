import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { forceCheck } from 'react-lazyload';
import * as differenceInHours from 'date-fns/difference_in_hours'

import { FetchStatusFlag } from 'app/constants';
import { BookState } from 'app/services/book';
import { BigBanner } from 'app/services/home';
import { ActionLoadHomeRequest, loadHomeRequest } from 'app/services/home/actions';
import { ConnectedBigBannerCarousel } from 'app/services/home/components/BigBanner';
import { ConnectedHomeSection } from 'app/services/home/components/HomeSection';
import { SelectionsState } from 'app/services/selection';
import { RidiSelectState } from 'app/store';
import { ConnectedHomeSectionList } from 'app/services/home/components/HomSectionList';

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
      bigBannerList,
    } = this.props;
    return (
      <main className='SceneWrapper PageHome'>
        <Helmet>
          <title>리디셀렉트</title>
        </Helmet>
        <div className="a11y"><h1>리디셀렉트 홈</h1></div>
        <ConnectedBigBannerCarousel
          items={bigBannerList}
        />
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
    bigBannerList: state.home.bigBannerList,
  };
};

const mapDispatchToProps = (dispatch: any): HomeDispatchProps => {
  return {
    dispatchLoadHomeRequest: () => dispatch(loadHomeRequest()),
  };
};

export const ConnectedHome = connect(mapStateToProps, mapDispatchToProps)(Home);
