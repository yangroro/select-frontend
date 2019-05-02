import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Button, Empty, Tab, Tabs } from '@ridi/rsg';

import { ConnectedPageHeader, DTOBookThumbnail, HelmetWithTitle, Pagination } from 'app/components';
import { PageTitleText, RoutePaths } from 'app/constants';
import { LandscapeBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { Book } from 'app/services/book';
import { Actions, ClosingReservedBooksState } from 'app/services/closingReservedBooks';
import { closingReservedTermType } from 'app/services/closingReservedBooks/requests';
import { getPageQuery } from 'app/services/routing/selectors';
import { RidiSelectState } from 'app/store';
import { stringifyAuthors } from 'app/utils/utils';
import MediaQuery from 'react-responsive';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router';
import { Link, LinkProps } from 'react-router-dom';

interface State {
  isInitialized: boolean;
  currentRenderedTerm: closingReservedTermType;
}

interface ClosingReservedBooksStateProps {
  closingReservedBooks: ClosingReservedBooksState;
  page: number;
}
interface ClosingReservedBookDispatchProps {
  dispatchLoadClosingReservedBooks: (termType: closingReservedTermType, page: number) => ReturnType<typeof Actions.loadClosingReservedBooksRequest>;
}

type OwnProps = RouteComponentProps<{}>;
type Props = ClosingReservedBooksStateProps & ClosingReservedBookDispatchProps & OwnProps;

export class ClosingReservedBooks extends React.Component<Props> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    isInitialized: false,
    currentRenderedTerm: 'thisMonth',
  };

  private isFetched = (renderedTerm: closingReservedTermType, page: number) => {
    const { closingReservedBooks } = this.props;

    const currentTermsBooks = closingReservedBooks[renderedTerm];
    return (currentTermsBooks && currentTermsBooks.itemListByPage[page] && currentTermsBooks.itemListByPage[page].isFetched);
  }

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      const { dispatchLoadClosingReservedBooks, page } = this.props;
      const { currentRenderedTerm } = this.state;
      if (!this.isFetched(currentRenderedTerm, page)) {
        dispatchLoadClosingReservedBooks(currentRenderedTerm, page);
      }

      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    });
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (nextProps.page !== this.props.page || nextState.currentRenderedTerm !== this.state.currentRenderedTerm) {
      const { dispatchLoadClosingReservedBooks, page } = nextProps;
      const { currentRenderedTerm } = nextState;

      if (!this.isFetched(currentRenderedTerm, page)) {
        dispatchLoadClosingReservedBooks(currentRenderedTerm, page);
      }
    }

    return true;
  }

  public componentWillUnmount() {
    if (this.initialDispatchTimeout) {
      window.clearTimeout(this.initialDispatchTimeout);
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    }
  }

  public renderTermText(term: closingReservedTermType) {
    const currentDateObj = new Date();
    return `${
      currentDateObj.getFullYear()
    }년 ${
      term === 'thisMonth' ? currentDateObj.getMonth() + 1 : currentDateObj.getMonth() + 2
    }월`;
  }

  public renderBooks(books: Book[]) {
    return (
      <div>
        <ul className="MySelectBookList">
          {books.map((book) => (
            <li className="MySelectBookList_Item" key={book.id}>
              <div className="MySelectBookList_Book">
                <DTOBookThumbnail
                  book={book}
                  width={100}
                  linkUrl={`/book/${book.id}`}
                  linkType="Link"
                  imageClassName="MySelectBookList_Thumbnail"
                  linkWrapperClassName="MySelectBookList_Link"
                />
                <div className="MySelectBookList_Right">
                  <Link to={`/book/${book.id}`} className="MySelectBookList_Link">
                    <div className="MySelectBookList_Meta">
                      <h2 className="MySelectBookList_Title">{book.title.main}</h2>
                      <span className="MySelectBookList_Authors">{stringifyAuthors(book.authors, 2)}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  public render() {
    const { page, closingReservedBooks } = this.props;
    const { currentRenderedTerm, isInitialized } = this.state;
    const { itemCount, itemListByPage } = closingReservedBooks[currentRenderedTerm];
    const itemCountPerPage: number = 24;
    return (
      <main className="SceneWrapper">
        <HelmetWithTitle titleName={PageTitleText.CLOSING_RESERVED_BOOKS} />
        <ConnectedPageHeader pageTitle={PageTitleText.CLOSING_RESERVED_BOOKS} />
        <Tabs className="ClosingReservedBooks_Tabs">
          <Tab
            className="ClosingReservedBooks_Tab"
            onClick={() => this.setState({ currentRenderedTerm: 'thisMonth' })}
          >
            {this.renderTermText('thisMonth')}
          </Tab>
          <Tab
            className="ClosingReservedBooks_Tab"
            onClick={() => this.setState({ currentRenderedTerm: 'nextMonth' })}
          >
            {this.renderTermText('nextMonth')}
          </Tab>
        </Tabs>
        {!isInitialized || !this.isFetched(currentRenderedTerm, page) || isNaN(page) ? (
          <LandscapeBookListSkeleton hasCheckbox={false} />
        ) : (
          <>
            {
              !itemCount || itemCount === 0 ? (
                <Empty description="종교 예정 도서가 없습니다." iconName="book_1" />
              ) : (
                <>
                  {this.renderBooks(itemListByPage[page].itemList)}
                  <MediaQuery maxWidth={840}>
                    {
                      (isMobile) => <Pagination
                        currentPage={page}
                        totalPages={Math.ceil(itemCount / itemCountPerPage)}
                        isMobile={isMobile}
                        item={{
                          el: Link,
                          getProps: (p): LinkProps => ({
                            to: `${RoutePaths.CLOSING_RESERVED_BOOKS}?page=${p}`,
                          }),
                        }}
                      />
                    }
                  </MediaQuery>
                </>
              )
            }
          </>
        )}
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): ClosingReservedBooksStateProps => {
  return {
    closingReservedBooks: rootState.closingReservedBooks,
    page: getPageQuery(rootState),
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    dispatchLoadClosingReservedBooks: (termType: closingReservedTermType, page: number) => dispatch(Actions.loadClosingReservedBooksRequest({ termType, page })),
  };
};

export const ConnectedClosingReservedBooks = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClosingReservedBooks),
);
