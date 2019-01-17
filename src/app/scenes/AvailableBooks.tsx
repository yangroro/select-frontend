import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { ConnectedPageHeader } from 'app/components';
import { ConnectedGridBookList } from 'app/components/GridBookList';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import { Actions, ReservedSelectionState } from 'app/services/selection';
import { RidiSelectState } from 'app/store';
import { Helmet } from 'react-helmet';

interface SelectionStateProps {
  availableBooks: ReservedSelectionState;
  books: BookState;
}

type RouteProps = RouteComponentProps<{}>;
type OwnProps = RouteProps & {
  hidePageTitle?: boolean;
};
type Props = SelectionStateProps & OwnProps & ReturnType<typeof mapDispatchToProps>;

export class AvailableBooks extends React.Component<Props> {
  public render() {
    const { dispatchLoadAvailableBooks, availableBooks, books, hidePageTitle = false } = this.props;
    return (
      <main className="SceneWrapper">
        <Helmet>
          <title>서비스 도서 목록 - 리디셀렉트</title>
        </Helmet>
        {!hidePageTitle && <ConnectedPageHeader pageTitle="서비스 도서 목록" />}
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

const mapStateToProps = (rootState: RidiSelectState): SelectionStateProps => {
  return {
    availableBooks: rootState.selectionsById.popular,
    books: rootState.booksById,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadAvailableBooks: (page: number) => dispatch(Actions.loadSelectionRequest({ selectionId: 'popular', page })),
  };
};
export const ConnectedAvailableBooks = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AvailableBooks),
);
