import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { ConnectedPageHeader } from 'app/components';
import { ConnectedGridBookList } from 'app/components/GridBookList';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { BookState } from 'app/services/book';
import { ReservedSelectionState } from 'app/services/selection';
import { ActionLoadSelectionRequest, loadSelectionRequest } from 'app/services/selection/actions';
import { RidiSelectState } from 'app/store';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { Helmet } from 'react-helmet';

interface SelectionStateProps {
  availableBooks: ReservedSelectionState;
  books: BookState;
}

interface SelectionDispatchProps {
  dispatchLoadAvailableBooks: (page: number) => ActionLoadSelectionRequest;
}

type RouteProps = RouteComponentProps<{}>;
type OwnProps = RouteProps & {
  hidePageTitle?: boolean;
};
type Props = SelectionStateProps & SelectionDispatchProps & OwnProps;

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
          renderPlaceholder={() => (<GridBookListSkeleton />) }
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
const mapDispatchToProps = (dispatch: any): SelectionDispatchProps => {
  return {
    dispatchLoadAvailableBooks: (page: number) => dispatch(loadSelectionRequest('popular', page)),
  };
};
export const ConnectedAvailableBooks = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AvailableBooks),
);
