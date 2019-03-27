import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { ConnectedGridBookList, HelmetWithTitle, PCPageHeader } from 'app/components';
import { PageTitleText } from 'app/constants';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import { Actions, ReservedCollectionState } from 'app/services/collection';
import { RidiSelectState } from 'app/store';

interface CollectionStateProps {
  newReleases: ReservedCollectionState;
  books: BookState;
}

interface CollectionDispatchProps {
  dispatchLoadNewReleases: (page: number) => ReturnType<typeof Actions.loadCollectionRequest>;
}

type RouteProps = RouteComponentProps<{}>;
type OwnProps = RouteProps;
type Props = CollectionStateProps & CollectionDispatchProps & OwnProps;

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
        <HelmetWithTitle titleName={PageTitleText.NEW_RELEASE} />
        <PCPageHeader pageTitle={PageTitleText.NEW_RELEASE} />
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

const mapStateToProps = (rootState: RidiSelectState): CollectionStateProps => {
  return {
    newReleases: rootState.collectionsById.recent,
    books: rootState.booksById,
  };
};
const mapDispatchToProps = (dispatch: any): CollectionDispatchProps => {
  return {
    dispatchLoadNewReleases: (page: number) => dispatch(Actions.loadCollectionRequest({ collectionId: 'recent', page })),
  };
};
export const ConnectedNewReleases = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewReleases),
);

export default ConnectedNewReleases;
