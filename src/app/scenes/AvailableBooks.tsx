import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { ConnectedGridBookList, ConnectedPageHeader, HelmetWithTitle } from 'app/components';
import { PageTitleText } from 'app/constants';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import { Actions, ReservedCollectionState } from 'app/services/collection';
import { RidiSelectState } from 'app/store';

interface CollectionStateProps {
  availableBooks: ReservedCollectionState;
  books: BookState;
}

type RouteProps = RouteComponentProps<{}>;
type Props = CollectionStateProps & RouteProps & ReturnType<typeof mapDispatchToProps>;

export class AvailableBooks extends React.Component<Props> {
  public render() {
    const { dispatchLoadAvailableBooks, availableBooks, books } = this.props;
    return (
      <main className="SceneWrapper">
        <HelmetWithTitle titleName={PageTitleText.AVAILABLE_BOOKS} />
        <ConnectedPageHeader pageTitle={PageTitleText.AVAILABLE_BOOKS} />
        <ConnectedListWithPagination
          isFetched={(page) =>
            availableBooks &&
            availableBooks.itemListByPage[page] &&
            availableBooks.itemListByPage[page].isFetched
          }
          fetch={(page) => dispatchLoadAvailableBooks(page)}
          itemCount={availableBooks ? availableBooks.itemCount : undefined}
          buildPaginationURL={(page: number) => `/books?page=${page}`}
          renderPlaceholder={() => (<GridBookListSkeleton />)}
          renderItems={(page) => (
            <ConnectedGridBookList
              pageTitleForTracking="available"
              books={availableBooks.itemListByPage[page].itemList.map((id) => books[id].book!)}
            />
          )}
        />
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): CollectionStateProps => {
  return {
    availableBooks: rootState.collectionsById.popular,
    books: rootState.booksById,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadAvailableBooks: (page: number) => dispatch(Actions.loadCollectionRequest({ collectionId: 'popular', page })),
  };
};
export const ConnectedAvailableBooks = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AvailableBooks),
);
