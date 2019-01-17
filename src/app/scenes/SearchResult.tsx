import * as qs from 'qs';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { Button, Icon } from '@ridi/rsg';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { LandscapeBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import { Actions as CommonUIActions, GNBSearchActiveType } from 'app/services/commonUI';
import { EnvironmentState } from 'app/services/environment';
import { SearchResultBook, SearchResultState } from 'app/services/searchResult';
import { Actions as SearchResultActions } from 'app/services/searchResult';
import { SearchResultBookList } from 'app/services/searchResult/components/SearchResultBookList';
import { RidiSelectState } from 'app/store';
import { Helmet } from 'react-helmet';

interface SearchResultStateProps {
  books: BookState;
  searchResult: SearchResultState;
  environment: EnvironmentState;
}

type OwnProps = RouteComponentProps;
type Props = SearchResultStateProps & ReturnType<typeof mapDispatchToProps> & OwnProps;

interface QueryString {
  'q'?: string;
}

interface State {
  query: string;
}

export class SearchResult extends React.Component<Props, State> {
  private unlistenToHistory: () => void;

  public state: State = {
    query: '',
  };

  private isListExist(list: any[]) {
    return list && list.length > 0;
  }

  private renderEmpty() {
    const { query } = this.state;

    return (
      <div className="SearchResult_EmptyWrapper">
        <div className="EmptyIcon">
          <Icon
            name="search"
            className="SearchResult_EmptyIcon"
          />
        </div>
        <h3 className="SearchResult_EmptyTitle">
          {`'`}<strong>{query}</strong>{`'에 대한 검색결과가 없습니다.`}
        </h3>
      </div>
    );
  }

  public componentWillMount() {
    this.props.dispatchUpdateGNBSearchActiveType(GNBSearchActiveType.block);
    const queryString: QueryString = qs.parse(this.props.location.search, { ignoreQueryPrefix: true });
    this.unlistenToHistory = this.props.history.listen((location) => {
      const newQueryString = qs.parse(location.search, { ignoreQueryPrefix: true });
      if (this.state.query !== newQueryString.q) {
        this.setState({ query: newQueryString.q });
      }
    });
    this.setState({ query: queryString.q || '' });
  }

  public componentWillUnmount() {
    this.props.dispatchUpdateGNBSearchActiveType(GNBSearchActiveType.cover);
    this.unlistenToHistory();
  }

  public render() {
    const { books, searchResult, dispatchRequestSearchResult, environment } = this.props;
    const { query } = this.state;

    return (
      <main className="SceneWrapper PageSearchResult">
        <Helmet>
          <title>{!!query ? `'${query}' 검색 결과 - 리디셀렉트` : '리디셀렉트'}</title>
        </Helmet>
        <h1 className="a11y">{`'`}<strong>{query}</strong>{`'에 대한 도서 검색 결과`}</h1>
        <ConnectedListWithPagination
          _key={query}
          isFetched={(page) => searchResult[query] &&
              searchResult[query].itemListByPage[page] &&
              searchResult[query].itemListByPage[page].isFetched
          }
          fetch={(page) => dispatchRequestSearchResult(query, page)}
          itemCount={searchResult[query] ? searchResult[query].itemCount : undefined}
          buildPaginationURL={(p: number) => `/search?q=${query}&page=${p}`}
          renderPlaceholder={() => (<LandscapeBookListSkeleton />)}
          renderItems={(page) => this.isListExist(searchResult[query].itemListByPage[page].itemList) ? (
            <>
              <p className="PageSearchResult_Title">
                {`'`}<strong>{query}</strong>{`'에 대한 도서 검색 결과`}
              </p>
              <SearchResultBookList
                keyword={query}
                books={searchResult[query].itemListByPage[page].itemList.map((item): SearchResultBook => {
                  return {
                    ...books[item.bookId].book!,
                    highlight: item.highlight,
                    publisher: item.publisher,
                  };
                })}
              />
            </>
          ) : this.renderEmpty()}
        >
          {
            !environment.platform.isRidibooks &&
            <Button
              color="blue"
              outline={true}
              component="a"
              href={`${environment.STORE_URL}/search?q=${encodeURIComponent(query)}`}
              className="PageSearchResult_RidibooksResult"
              size="large"
            >
              리디북스 검색 결과 보기
              <Icon
                name="arrow_5_right"
                className="PageSearchResult_RidibooksResultIcon"
              />
            </Button>
          }
        </ConnectedListWithPagination>
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): SearchResultStateProps => {
  return {
    books: rootState.booksById,
    searchResult: rootState.searchResult,
    environment: rootState.environment,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchRequestSearchResult: (keyword: string, page: number) =>
      dispatch(SearchResultActions.queryKeywordRequest({ keyword, page })),
    dispatchUpdateGNBSearchActiveType: (type: GNBSearchActiveType) =>
      dispatch(CommonUIActions.updateSearchActiveType({ gnbSearchActiveType: type })),
  };
};
export const ConnectedSearchResult = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SearchResult),
);
