import { AxiosError, AxiosResponse } from 'axios';
import * as classNames from 'classnames';
import { take, isString } from 'lodash-es';
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { Subscription, Observable, Subject } from 'rxjs';
import * as qs from 'qs';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';

import history from 'app/config/history';

import { camelize } from '@ridi/object-case-converter';
import { Icon } from '@ridi/rsg/components/dist/icon';
import { FetchStatusFlag } from 'app/constants';
import { GNBColorLevel, GNBSearchActiveType, RGB, toRGBString } from 'app/services/commonUI';
import {
  InstantSearch,
  SearchHelperFlag,
  SearchHistory,
} from 'app/services/search';
import { localStorageManager } from 'app/services/search/utils';
import { RidiSelectState } from 'app/store';
import request from 'app/utils/request';
import { setDisableScroll } from 'app/utils/utils';
import toast from 'app/utils/toast';

export interface InstantSearchResultBook {
  id: string;
  title: string;
  author: string;
  publisher: string;
  highlightTitle: string;
  highlightAuthor: string;
  highlightPublisher: string;
}

interface SearchStoreProps {
  gnbColor: RGB;
  gnbColorLevel: GNBColorLevel;
  gnbSearchActiveType: GNBSearchActiveType;
  isRidiApp: boolean;
  searchQuery: string;
}

interface SearchCascadedProps {
  isMobile: boolean;
}

type SearchProps = SearchStoreProps & SearchCascadedProps;

interface HistoryState {
  enabled: boolean;
  keywordList: string[];
}

interface QueryString {
  'q'?: string;
}

interface SearchState {
  fetchStatus: FetchStatusFlag;
  keyword: string;
  isActive: boolean;
  isClearButtonVisible: boolean;
  highlightIndex: number;
  currentHelperType: SearchHelperFlag;
  history: HistoryState;
  instantSearchResultsByKeyword: {
    [instantSearchKeyword: string]: InstantSearchResultBook[];
  };
}


enum KeyboardCode {
  ArrowUp = 38,
  ArrowDown = 40,
  Enter = 13,
}

export class Search extends React.Component<SearchProps, SearchState> {
  // set member variables type
  private onSearchChange$ = new Subject();
  private onSearchKeydown$ = new Subject();
  private searchComponentWrapper: HTMLElement | null;
  private searchInput: HTMLInputElement | null;
  private closeFunctionOnWindow = (event: MouseEvent): void => this.handleOutsideClick(event);
  private keydownSubscription: Subscription;
  private inputSubscription: Subscription;

  public state: SearchState = this.getInitialState();

  // set initial private state
  private getInitialState(): SearchState {
    const { enabled = true, keywordList = [] } = localStorageManager.load().history;

    return {
      fetchStatus: FetchStatusFlag.IDLE,
      keyword: '',
      isActive: false,
      isClearButtonVisible: false,
      highlightIndex: -1,
      currentHelperType: SearchHelperFlag.NONE,
      history: { enabled, keywordList },
      instantSearchResultsByKeyword: {},
    };
  }

  private setStateClean(keyword: string = ''): void {
    this.setState({
      isActive: false,
      keyword,
      highlightIndex: -1,
      currentHelperType: SearchHelperFlag.NONE,
      isClearButtonVisible: false,
    }, () => {
      this.searchInput && this.searchInput.blur();
    });
  }

  // private methods
  private setHistoryStateAndLocalStorage(historyObj: HistoryState): void {
    this.setState({
      history: historyObj,
    }, () => {
      localStorageManager.save({
        history: {
          ...this.state.history,
        },
      });
    });
  }

  private toggleSavingHistory(): void {
    const updatedHistoryState = {
      enabled: !this.state.history.enabled,
      keywordList: this.state.history.keywordList,
    };
    this.setHistoryStateAndLocalStorage(updatedHistoryState);
  }

  private pushHistoryKeyword(keyword: string): void {
    if (!this.state.history.enabled) {
      return;
    }
    const filteredKeywordList: string[] = this.state.history.keywordList
      .filter((listItem: string) => listItem !== keyword)
      .filter((listItem: string) => listItem.length > 0);
    const updatedHistoryState: HistoryState = {
      enabled: this.state.history.enabled,
      keywordList: [
        keyword,
        ...take(filteredKeywordList, 4),
      ],
    };
    this.setHistoryStateAndLocalStorage(updatedHistoryState);
  }

  private clearHistory(): void {
    const updatedHistoryState = {
      enabled: this.state.history.enabled,
      keywordList: [],
    };
    this.setHistoryStateAndLocalStorage(updatedHistoryState);
  }

  private removeHistoryKeyword(keyword: string): void {
    const filteredKeywordList: string[] = this.state.history.keywordList
      .filter((listItem: string) => listItem !== keyword);
    const updatedHistoryState = {
      enabled: this.state.history.enabled,
      keywordList: filteredKeywordList,
    };
    this.setHistoryStateAndLocalStorage(updatedHistoryState);
  }

  private manageScrollDisable(isDisable: boolean): void {
    const { isMobile, isRidiApp } = this.props;
    if (isMobile || isRidiApp) {
      setDisableScroll(isDisable);
    }
  }

  private getInstantSearchedList(value: string) {
    const { instantSearchResultsByKeyword } = this.state;
    if (instantSearchResultsByKeyword[value] &&
      (instantSearchResultsByKeyword[value].length > 0)
    ) {
      this.setState({
        isActive: true,
        fetchStatus: FetchStatusFlag.IDLE,
        currentHelperType: SearchHelperFlag.INSTANT,
      }, () => this.manageScrollDisable(false));
      return;
    }
    this.setState({
      isActive: true,
      fetchStatus: FetchStatusFlag.FETCHING,
      currentHelperType: SearchHelperFlag.INSTANT,
    }, () => {
      request({
        method: 'get',
        url: '/api/search/instant',
        params: { keyword: value },
      }).then((axResponse: AxiosResponse) => this.setState({
        fetchStatus: FetchStatusFlag.IDLE,
        instantSearchResultsByKeyword: {
          ...instantSearchResultsByKeyword,
          [value]: camelize(axResponse.data.books, { recursive: true }),
        },
      }, () => this.manageScrollDisable(false)))
      .catch((axError: AxiosError) => this.setState({
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
        currentHelperType: SearchHelperFlag.NONE,
      }, () => this.manageScrollDisable(false)));
    });
  }

  private toggleActivation(isTargetActive: boolean): void {
    const { isActive } = this.state;
    if (isActive === isTargetActive) {
      return;
    }
    window.removeEventListener('click', this.closeFunctionOnWindow!, true);
    this.manageScrollDisable(isTargetActive);
    if (!isTargetActive) {
      this.setStateClean();
      return;
    }
    window.addEventListener('click', this.closeFunctionOnWindow!, true);
    const { keyword } = this.state;
    const targetState = {
      isActive: isTargetActive,
      keyword,
      highlightIndex: -1,
      currentHelperType: SearchHelperFlag.HISTORY,
      isClearButtonVisible: true,
    };
    if (this.props.gnbSearchActiveType !== GNBSearchActiveType.block) {
      targetState.keyword = '';
      targetState.isClearButtonVisible = false;
    } else if (keyword.length > 0) {
      this.getInstantSearchedList(keyword);
      targetState.currentHelperType = SearchHelperFlag.INSTANT;
    }
    this.setState(targetState, () => {
      this.searchInput && this.searchInput.focus();
    });
  }

  private clearSearchInput(): void {
    this.setState({
      keyword: '',
      isClearButtonVisible: false,
      currentHelperType: SearchHelperFlag.HISTORY,
    }, () => this.searchInput && this.searchInput.focus());
  }

  private updateHighlightIndex(idx: number): void {
    this.setState({
      highlightIndex: idx,
    });
  }

  private linkToBookDetail(book: InstantSearchResultBook): void {
    if (!book) {
      toast.defaultErrorMessage();
      return;
    }
    let targetKeyword = '';
    if (book.highlightTitle) {
      targetKeyword = book.title;
    } else if (book.highlightAuthor) {
      targetKeyword = book.author;
    } else if (book.highlightPublisher) {
      targetKeyword = book.publisher;
    }
    this.manageScrollDisable(false);
    this.setStateClean();
    this.pushHistoryKeyword(targetKeyword);
    history.push(`/book/${book.id}?q=${encodeURIComponent(targetKeyword)}&s=instant`);
  }

  private fullSearchWithKeyword(keyword: string): void {
    if (keyword.length <= 0) {
      return;
    }
    this.manageScrollDisable(false);
    history.push(`/search?q=${encodeURIComponent(keyword)}`);
    this.pushHistoryKeyword(keyword);
    setTimeout(() => this.setStateClean(keyword), 0);
  }

  private doSearchAction(value: string): void {
    const { keyword, highlightIndex, currentHelperType } = this.state;
    const { keywordList } = this.state.history;
    const instantSearchResultList = this.state.instantSearchResultsByKeyword[keyword];

    if (highlightIndex < 0) {
      this.fullSearchWithKeyword(value);
      return;
    }

    if (currentHelperType === SearchHelperFlag.INSTANT) {
      this.linkToBookDetail(instantSearchResultList[highlightIndex]);
      return;
    }

    if (currentHelperType === SearchHelperFlag.HISTORY) {
      this.fullSearchWithKeyword(keywordList[highlightIndex]);
    }
  }

  private getMovedHighlightIndex(
    keyType: number,
    currentIndex: number,
    currentList: string[] | InstantSearchResultBook[],
  ): number {
    switch (keyType) {
      case KeyboardCode.ArrowDown:
        return currentIndex + 1 >= currentList.length ? currentIndex : currentIndex + 1;
      case KeyboardCode.ArrowUp:
        return currentIndex - 1 < 0 ? 0 : currentIndex - 1;
      default:
        return currentIndex;
    }
  }

  private subscribeKeyboardEvent(): void {
    if (!this.searchInput) {
      return;
    }

    // functional key event observable
    this.keydownSubscription = this.onSearchKeydown$
      .filter((e: any) => (e.keyCode === 13 || e.keyCode === 38 || e.keyCode === 40))
      .map((e: any) => {
        e.preventDefault();
        return {
          keyType: e.keyCode,
          value: e.target.value,
          currentHelperList: (this.state.currentHelperType === SearchHelperFlag.HISTORY) ?
            this.state.history.keywordList :
            this.state.instantSearchResultsByKeyword[this.state.keyword],
        };
      })
      .throttleTime(100)
      .subscribe((obj: {
        keyType: KeyboardCode;
        value: string;
        currentHelperList: string[] | InstantSearchResultBook[];
      }): void => {
        const {
          keyword,
          currentHelperType,
          history,
          instantSearchResultsByKeyword,
          fetchStatus,
          highlightIndex
        } = this.state;
        if (obj.keyType === KeyboardCode.Enter) {
          this.doSearchAction(obj.value);
          return;
        }
        if (currentHelperType === SearchHelperFlag.HISTORY && !history.enabled) {
          this.setState({ highlightIndex: -1 });
          return;
        }
        if (currentHelperType !== SearchHelperFlag.NONE) {
          this.setState({
            highlightIndex:
              fetchStatus === FetchStatusFlag.FETCHING ?
                -1 :
                this.getMovedHighlightIndex(obj.keyType, highlightIndex, obj.currentHelperList),
          });
        } else if (keyword.length > 0 && instantSearchResultsByKeyword[keyword].length > 0) {
          this.setState({
            highlightIndex:
              fetchStatus === FetchStatusFlag.FETCHING ? -1 : 0,
            currentHelperType: fetchStatus === FetchStatusFlag.FETCHING ?
              SearchHelperFlag.NONE : SearchHelperFlag.INSTANT,
          });
        } else if (keyword.length === 0) {
          this.setState({
            highlightIndex: 0,
            currentHelperType: SearchHelperFlag.HISTORY,
          });
        }
      });

    // input value change event observable
    this.inputSubscription = this.onSearchChange$
      .do((value: string): void => this.setState({
        keyword: value,
        highlightIndex: -1,
        isClearButtonVisible: true,
        currentHelperType: value.length > 0 ? this.state.currentHelperType : SearchHelperFlag.HISTORY,
      }))
      .distinctUntilChanged()
      .debounceTime(150)
      .subscribe((value: string): void => {
        if (value.length === 0) {
          this.setState({

            isActive: true,
            isClearButtonVisible: false,
            currentHelperType: SearchHelperFlag.HISTORY
          });
          return;
        }
        this.getInstantSearchedList(value);
      });
  }

  private onSearchChange(e: any): void {
    const searchKeyword = e.target.value;
    this.onSearchChange$.next(searchKeyword);
  }

  private onSearchKeydown(e: any): void {
    this.onSearchKeydown$.next(e);
  }

  private handleOutsideClick(e: any): void {
    if (
      this.searchComponentWrapper &&
      this.searchComponentWrapper.contains(e.target)
    ) {
      return;
    }

    const targetKeyword = (this.props.gnbSearchActiveType === GNBSearchActiveType.block) ?
      this.state.keyword : '';
    this.toggleActivation(false);
    this.setStateClean(targetKeyword);
  }

  // component life cycle handler
  public componentDidMount(): void {
    this.subscribeKeyboardEvent();
  }

  public componentWillReceiveProps(nextProps: SearchProps): void {
    const queryString: QueryString = qs.parse(nextProps.searchQuery, { ignoreQueryPrefix: true });
    const keywordText: string = (queryString && queryString.q && isString(queryString.q)) ? queryString.q : '';
    this.setState({
      keyword: keywordText,
    }, () => this.pushHistoryKeyword(keywordText));
  }

  public componentWillUnmount(): void {
    this.keydownSubscription.unsubscribe();
    this.inputSubscription.unsubscribe();
  }

  // render
  public render() {
    const {
      keyword,
      fetchStatus,
      isActive,
      isClearButtonVisible,
      highlightIndex,
      currentHelperType,
    } = this.state;
    const {
      isMobile,
      gnbColor,
      gnbColorLevel,
      gnbSearchActiveType,
    } = this.props;
    const instantSearchResultList = this.state.instantSearchResultsByKeyword[keyword];
    const { enabled, keywordList } = this.state.history;
    const inputEvents = {
      onChange: (e: any) => this.onSearchChange(e),
      onKeyDown: (e: any) => this.onSearchKeydown(e),
    };

    Object.assign(inputEvents, isMobile ? {
      onTouchStart: () => this.toggleActivation(true),
    } : {
      onClick: () => this.toggleActivation(true),
    });

    return (
      <div
        className={classNames({
          'GNBSearchWrapper': true,
          'active': isActive,
          'GNBSearchWrapper-colored': gnbColorLevel !== 'default',
          'GNBSearchWrapper-typeBlock': gnbSearchActiveType === GNBSearchActiveType.block,
        })}
        style={{ background: toRGBString(gnbColor), }}
        ref={(ref) => { this.searchComponentWrapper = ref; }}
      >
        <button
          type="button"
          className="GNBSearchButton"
          onClick={() => this.toggleActivation(!isActive)}
        >
          <Icon
            name={isActive ? 'arrow_13_left' : 'search'}
            className="GNBSearchButtonIcon"
          />
          <h2 className="a11y">검색</h2>
        </button>
        <div className={classNames(
          'GNBSearchInputWrapper',
          isClearButtonVisible ? null : 'GNBSearchInputWrapper-empty',
        )}>
          <Icon name="search" className="GNBSearchIcon" />
          <input
            className="GNBSearchInput"
            type="search"
            role="search"
            autoCorrect="off"
            autoComplete="off"
            autoCapitalize="off"
            placeholder="제목, 저자, 출판사 검색"
            value={keyword}
            ref={(ref) => { this.searchInput = ref; }}
            {...inputEvents}
            maxLength={150}
          />
          {isClearButtonVisible && keyword.length > 0 ? (
            <button
              className="GNBSearchResetButton"
              type="button"
              onClick={() => this.clearSearchInput()}
            >
              <Icon
                name="close_2"
                className="GNBSearchResetButtonIcon"
              />
              <span className="a11y">검색어 비우기</span>
            </button>
          ) : null}
        </div>
        <InstantSearch
          keyword={keyword}
          isActive={isActive && currentHelperType === SearchHelperFlag.INSTANT}
          fetchStatus={fetchStatus}
          instantSearchList={instantSearchResultList}
          highlightIndex={highlightIndex}
          updateHighlight={(idx: number) => this.updateHighlightIndex(idx)}
          onSearchItemClick={(book: InstantSearchResultBook) => this.linkToBookDetail(book)}
        />
        <SearchHistory
          isActive={isActive && currentHelperType === SearchHelperFlag.HISTORY}
          highlightIndex={highlightIndex}
          updateHighlight={(idx: number) => this.updateHighlightIndex(idx)}
          savingHistoryEnabled={enabled}
          keywordList={keywordList}
          toggleSavingHistory={() => this.toggleSavingHistory()}
          clearHistory={() => this.clearHistory()}
          removeKeyword={(targetKeyword: string) => this.removeHistoryKeyword(targetKeyword)}
          resetSearchState={() => {
            this.manageScrollDisable(false);
            this.toggleActivation(false);
          }}
        />
        {isMobile ? (<span
          className="dim"
          onClick={() => {
            this.manageScrollDisable(false);
            this.setState({ isActive: false, isClearButtonVisible: false });
          }}
        />) : null}
      </div>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): SearchStoreProps => {
  return {
    gnbColor: state.commonUI.gnbColor,
    gnbColorLevel: state.commonUI.gnbColorLevel,
    gnbSearchActiveType: state.commonUI.gnbSearchActiveType,
    isRidiApp: state.environment.platform.isRidiApp,
    searchQuery: state.router.location!.search,
  };
};

export const ConnectedSearch = connect(mapStateToProps)(Search);
