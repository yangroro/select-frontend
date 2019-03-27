import * as React from 'react';

import { ConnectedGridBookList, ConnectedPageHeader, HelmetWithTitle } from 'app/components';
import { PageTitleText } from 'app/constants';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import { Actions, ChartCollectionState } from 'app/services/collection';
import { RidiSelectState } from 'app/store';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

interface CollectionStateProps {
  collection: ChartCollectionState;
  books: BookState;
}

type RouteProps = RouteComponentProps<{}>;
type OwnProps = RouteProps;
type Props = CollectionStateProps & OwnProps & ReturnType<typeof mapDispatchToProps>;

export class Charts extends React.Component<Props> {
  public render() {
    const { dispatchLoadNewReleases, collection, books } = this.props;
    return (
      <main className="SceneWrapper">
        <HelmetWithTitle titleName={PageTitleText.CHARTS} />
        <ConnectedPageHeader pageTitle={PageTitleText.CHARTS} />
        <ConnectedListWithPagination
          isFetched={(page) =>
            collection &&
            collection.itemListByPage[page] &&
            collection.itemListByPage[page].isFetched
          }
          fetch={(page) => dispatchLoadNewReleases(page)}
          itemCount={collection ? collection.itemCount : undefined}
          buildPaginationURL={(page: number) => `/charts?page=${page}`}
          renderPlaceholder={() => (<GridBookListSkeleton displayRanking={true} />)}
          renderItems={(page) => (
            <ConnectedGridBookList
              pageTitleForTracking="popular"
              books={collection.itemListByPage[page].itemList.map((id) => books[id].book!)}
              isChart={true}
              page={page}
            />
          )}
        />
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): CollectionStateProps => {
  return {
    collection: rootState.collectionsById.popular,
    books: rootState.booksById,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadNewReleases: (page: number) => dispatch(Actions.loadCollectionRequest({ collectionId: 'popular', page })),
  };
};
export const ConnectedCharts = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Charts),
);

export default ConnectedCharts;
