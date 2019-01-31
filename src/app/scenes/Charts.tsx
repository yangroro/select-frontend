import * as React from 'react';

import { ConnectedPageHeader } from 'app/components';
import { ConnectedGridBookList } from 'app/components/GridBookList';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import { Actions, ChartSelectionState } from 'app/services/selection';
import { RidiSelectState } from 'app/store';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

interface SelectionStateProps {
  selection: ChartSelectionState;
  books: BookState;
}

type RouteProps = RouteComponentProps<{}>;
type OwnProps = RouteProps;
type Props = SelectionStateProps & OwnProps & ReturnType<typeof mapDispatchToProps>;

export class Charts extends React.Component<Props> {
  public render() {
    const { dispatchLoadNewReleases, selection, books } = this.props;
    return (
      <main className="SceneWrapper">
        <Helmet title="인기 도서 - 리디셀렉트" />
        <ConnectedPageHeader pageTitle="인기 도서" />
        <ConnectedListWithPagination
          isFetched={(page) =>
            selection &&
            selection.itemListByPage[page] &&
            selection.itemListByPage[page].isFetched
          }
          fetch={(page) => dispatchLoadNewReleases(page)}
          itemCount={selection ? selection.itemCount : undefined}
          buildPaginationURL={(page: number) => `/charts?page=${page}`}
          renderPlaceholder={() => (<GridBookListSkeleton displayRanking={true} />)}
          renderItems={(page) => (
            <ConnectedGridBookList
              pageTitleForTracking="popular"
              books={selection.itemListByPage[page].itemList.map((id) => books[id].book!)}
              isChart={true}
              page={page}
            />
          )}
        />
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): SelectionStateProps => {
  return {
    selection: rootState.selectionsById.popular,
    books: rootState.booksById,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadNewReleases: (page: number) => dispatch(Actions.loadSelectionRequest({ selectionId: 'popular', page })),
  };
};
export const ConnectedCharts = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Charts),
);

export default ConnectedCharts;
