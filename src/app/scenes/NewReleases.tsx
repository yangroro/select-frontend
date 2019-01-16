import { ConnectedGridBookList, PCPageHeader } from 'app/components';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import { Actions, ReservedSelectionState } from 'app/services/selection';
import { RidiSelectState } from 'app/store';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

interface SelectionStateProps {
  newReleases: ReservedSelectionState;
  books: BookState;
}

interface SelectionDispatchProps {
  dispatchLoadNewReleases: (page: number) => ReturnType<typeof Actions.loadSelectionRequest>;
}

type RouteProps = RouteComponentProps<{}>;
type OwnProps = RouteProps;
type Props = SelectionStateProps & SelectionDispatchProps & OwnProps;

interface State {
  isInitialized: boolean;
}

export class NewReleases extends React.Component<Props> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    isInitialized: false,
  };

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
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
    const { dispatchLoadNewReleases, newReleases, books } = this.props;
    return (
      <main className="SceneWrapper">
        <Helmet>
          <title>최신 업데이트 - 리디셀렉트</title>
        </Helmet>
        <PCPageHeader pageTitle="최신 업데이트" />
        {(
          !this.state.isInitialized
        ) ? (
          <GridBookListSkeleton />
        ) : (
          <ConnectedListWithPagination
            isFetched={(page) =>
              newReleases &&
              newReleases.itemListByPage[page] &&
              newReleases.itemListByPage[page].isFetched
            }
            fetch={(page) => dispatchLoadNewReleases(page)}
            itemCount={newReleases ? newReleases.itemCount : undefined}
            buildPaginationURL={(page: number) => `/new-releases?page=${page}`}
            renderPlaceholder={() => (<GridBookListSkeleton />)}
            renderItems={(page) => (
              <ConnectedGridBookList
                pageTitleForTracking="recent"
                books={newReleases.itemListByPage[page].itemList.map((id) => books[id].book!)}
              />
            )}
          />
        )}
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): SelectionStateProps => {
  return {
    newReleases: rootState.selectionsById.recent,
    books: rootState.booksById,
  };
};
const mapDispatchToProps = (dispatch: any): SelectionDispatchProps => {
  return {
    dispatchLoadNewReleases: (page: number) => dispatch(Actions.loadSelectionRequest({ selectionId: 'recent', page })),
  };
};
export const ConnectedNewReleases = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewReleases),
);

export default ConnectedNewReleases;
