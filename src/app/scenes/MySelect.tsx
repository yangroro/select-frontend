import { Button } from '@ridi/rsg/components/dist/button';
import { CheckBox } from '@ridi/rsg/components/dist/check_box';
import { Empty } from '@ridi/rsg/components/dist/empty';
import { PCPageHeader } from 'app/components';
import { FetchStatusFlag } from 'app/constants';
import { MySelectBook } from 'app/services/mySelect';
import {
  ActionDeleteMySelectRequest,
  deleteMySelectRequest,
  loadMySelectRequest,
} from 'app/services/mySelect/actions';
import { ActionLoadSelectionRequest } from 'app/services/selection/actions';
import { RidiSelectState } from 'app/store';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { DTOBookThumbnail } from 'app/components/DTOBookThumbnail';
import { downloadBooksInRidiselect } from 'app/utils/downloadUserBook';
import { LandscapeBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import toast from 'app/utils/toast';
import { stringifyAuthors } from 'app/utils/utils';

interface StateProps {
  books: MySelectBook[];
  fetchStatus: FetchStatusFlag;
  deletionFetchStatus: FetchStatusFlag;
}

interface DispatchProps {
  dispatchLoadMySelectRequest: () => ActionLoadSelectionRequest;
  dispatchDeleteMySelectRequest: (mySelectBookIds: number[]) => ActionDeleteMySelectRequest;
}

type Props = StateProps & DispatchProps;

interface State {
  bookInputs: {
    [mySelectBookId: string]: boolean;
  };
  isInitialized: boolean;
}

class MySelect extends React.Component<Props, State> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    bookInputs: {},
    isInitialized: false,
  };

  private handleDeleteButtonClick = () => {
    const { bookInputs } = this.state;
    const { deletionFetchStatus, dispatchDeleteMySelectRequest, books } = this.props;
    const bookEntries: Array<[string, boolean]> = Object.entries(bookInputs);
    if (!bookEntries.some((entry) => entry[1]) || deletionFetchStatus !== FetchStatusFlag.IDLE) {
      toast.fail('삭제할 책을 선택해주세요.');
      return;
    }
    if (!confirm('삭제하시겠습니까?')) {
      return;
    }
    const mySelectBookIds = this.props.books
      .filter((book) => !!bookInputs[book.mySelectBookId])
      .map((book) => book.mySelectBookId);
    dispatchDeleteMySelectRequest(mySelectBookIds);
  }

  private handleDownloadSelectedBooksButtonClick = () => {
    const { bookInputs } = this.state;
    const bookEntries: Array<[string, boolean]> = Object.entries(bookInputs);
    if (bookEntries.filter(([_, selected]) => selected).length === 0) {
      toast.fail('다운로드할 책을 선택해주세요.');
      return;
    }
    const bookIds = this.props.books
      .filter((book) => !!bookInputs[book.mySelectBookId])
      .map((book) => book.id);
    downloadBooksInRidiselect(bookIds);
  }

  private handleDownloadBookButtonClick = (book: MySelectBook) => () => {
    downloadBooksInRidiselect([book.id]);
  }

  private handleSelectAllCheckBoxChange = () => {
    this.setState({
      bookInputs: this.props.books.reduce((prev, book) => {
        return {
          ...prev,
          [book.mySelectBookId]: !this.areEveryBookChecked(),
        };
      }, {}),
    })
  }

  private areEveryBookChecked = () => Object.keys(this.state.bookInputs).length > 0 &&
    this.props.books.every((book) => this.state.bookInputs[book.mySelectBookId]);

  public componentDidMount() {
    this.initialDispatchTimeout = window.setTimeout(() => {
      this.props.dispatchLoadMySelectRequest();
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    });
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.books.length !== this.props.books.length) {
      // Set up state for checkboxes
      this.setState({
        bookInputs: Object.values(this.props.books).reduce((prev, book: MySelectBook) => {
          return {
            ...prev,
            [book.mySelectBookId]: this.state.bookInputs[book.mySelectBookId] || false,
          };
        }, {}),
      });
    }
  }

  public componentWillUnmount() {
    if (this.initialDispatchTimeout) {
      window.clearTimeout(this.initialDispatchTimeout);
      this.initialDispatchTimeout = null;
      this.setState({ isInitialized: true });
    }
  }

  public renderBooks() {
    const { books } = this.props;
    return (
      <div>
        <ul className="MySelectBookList">
          {books.map((book) => (
            <li className="MySelectBookList_Item" key={book.mySelectBookId}>
              <CheckBox
                className="MySelectBookList_CheckBox"
                checked={this.state.bookInputs[book.mySelectBookId] || false}
                onChange={(e) =>
                  this.setState({
                    ...this.state,
                    bookInputs: {
                      ...this.state.bookInputs,
                      [book.mySelectBookId]: e.target.checked,
                    },
                  })
                }
              />
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
                  <Button
                    color="blue"
                    className="MySelectBookList_IndividualDownload"
                    onClick={this.handleDownloadBookButtonClick(book)}
                  >
                    다운로드
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  public render() {
    const { books, fetchStatus } = this.props;
    return (
      <main className="SceneWrapper">
        <Helmet>
          <title>마이 셀렉트 - 리디셀렉트</title>
        </Helmet>
        {(
          !this.state.isInitialized ||
          fetchStatus === FetchStatusFlag.FETCHING
        ) ? (
          <div className="PageMySelect Skeleton_Wrapper">
            <PCPageHeader pageTitle="마이 셀렉트" />
            <LandscapeBookListSkeleton hasCheckbox={true} />
          </div>
        ) : (books.length === 0
          ? <div className="PageMySelect">
              <Empty description="마이 셀렉트에 등록된 도서가 없습니다." iconName="book_1" />
            </div>
          : <>
              <PCPageHeader pageTitle="마이 셀렉트" />
              <div className="PageMySelect">
                <div className="MySelectControls">
                  <div className="MySelectControls_CheckBoxWrapper">
                    <CheckBox
                      className="MySelectControls_CheckBox"
                      checked={this.areEveryBookChecked()}
                      onChange={this.handleSelectAllCheckBoxChange}
                    >
                      전체 선택
                    </CheckBox>
                  </div>
                  <Button
                    onClick={this.handleDeleteButtonClick}
                    className="MySelectControls_Button"
                    outline={true}
                    spinner={this.props.deletionFetchStatus === FetchStatusFlag.FETCHING}
                  >
                    선택 삭제
                  </Button>
                  <Button
                    className="MySelectControls_Button"
                    color="blue"
                    onClick={this.handleDownloadSelectedBooksButtonClick}
                  >
                    다운로드
                  </Button>
                </div>
              {this.renderBooks()}
              </div>
            </>
          )}
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): StateProps => {
  return {
    books: state.mySelect.books,
    fetchStatus: state.mySelect.fetchStatus,
    deletionFetchStatus: state.mySelect.deletionFetchStatus,
  };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
    dispatchLoadMySelectRequest: () => dispatch(loadMySelectRequest()),
    dispatchDeleteMySelectRequest: (mySelectBookIds: number[]) => dispatch(deleteMySelectRequest(mySelectBookIds)),
  };
};

export const ConnectedMySelect = connect(mapStateToProps, mapDispatchToProps)(MySelect);
