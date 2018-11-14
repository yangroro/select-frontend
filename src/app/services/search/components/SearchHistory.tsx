import * as React from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@ridi/rsg/components/dist/icon';

interface SearchHistoryProps {
  isActive: boolean;
  highlightIndex: number;
  updateHighlight: (idx: number) => void;
  savingHistoryEnabled: boolean;
  keywordList: string[];
  toggleSavingHistory: () => void;
  clearHistory: () => void;
  removeKeyword: (keyword: string) => void;
  resetSearchState: () => void;
}

export class SearchHistory extends React.PureComponent<SearchHistoryProps> {
  public render() {
    const {
      isActive,
      highlightIndex,
      updateHighlight,
      savingHistoryEnabled,
      keywordList,
      toggleSavingHistory,
      clearHistory,
      removeKeyword,
      resetSearchState,
    } = this.props;

    if (!isActive || keywordList.length === 0) {
      return null;
    }
    return (
      <div className="SearchHistoryWrapper">
        <ul className="SearchHistoryList">
          {savingHistoryEnabled ? keywordList
            .filter((keyword) => keyword.length > 0)
            .map((keyword, idx) => (
              <li
                className={`SearchHistoryItem${highlightIndex === idx ? ' focused' : ''}`}
                onMouseOver={() => updateHighlight(idx)}
                key={`search_history_${idx}`}
              >
                <Link
                  className="SearchHistoryKeyword"
                  to={`/search?q=${keyword}`}
                  onClick={() => resetSearchState()}
                >
                  {keyword}
                </Link>
                <button
                  className="RemoveSearchHistoryButton"
                  type="button"
                  onClick={() => removeKeyword(keyword)}
                >
                  <Icon
                    name="close_2"
                    className="RemoveSearchHistoryIcon"
                  />
                  <span className="a11y">{keyword} 검색어를 기록에서 지우기</span>
                </button>
              </li>
            )) : null
          }
        </ul>
        <div className="SearchHistoryFooter">
          {savingHistoryEnabled ? (
            <button
              className="ClearHistoryButton"
              type="button"
              onClick={() => clearHistory()}
            >
              <span className="a11y">검색어 기록</span>
              전체 삭제
            </button>
          ) : <span />}
          <button
            className="ToggleStoreHistoryButton"
            type="button"
            onClick={() => toggleSavingHistory()}
          >
            검색어 저장 {`${savingHistoryEnabled ? '끄기' : '켜기'}`}
          </button>
        </div>
      </div>
    );
  }
}
