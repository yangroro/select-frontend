import { Button, Icon } from '@ridi/rsg';
import * as React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isMobile: boolean;
  item: {
    el?: React.ReactType;
    getProps?: (page: number) => any;
  };
}

// TODO: 추후 Ridi Web UI 업데이트 되고 반영하게 되면 아래 페이지네이션 코드는 Ridi Web UI로 대체되어야 함.
export const Pagination: React.SFC<PaginationProps> = (props) => {
  const {
    currentPage,
    totalPages,
    isMobile,
    item,
  } = props;
  const {
    el = 'a',
    getProps = (page?: number) => ({}),
  } = item;

  const sibilingPagesRange = isMobile ? 2 : 4;
  const maxButtonsCount = 1 + (sibilingPagesRange * 2);
  const displayGoFirst = !isMobile && (currentPage > sibilingPagesRange + 1);
  const displayGoPrev = currentPage !== 1;
  const displayGoNext = currentPage !== totalPages;
  const { max, min } = Math;

  const start = min(
    max(1, currentPage - sibilingPagesRange),
    max(totalPages - (maxButtonsCount - 1), 1)
  );
  const end = min(
    max(currentPage + sibilingPagesRange, start + (maxButtonsCount - 1)),
    totalPages
  );
  const pageNumbers = Array.from({ length: end - start + 1 }, (v, k) => k + start);

  if (totalPages === 1) { return null; }
  return (
    <nav aria-label="페이지 내비게이션">
      <h2 className="a11y indent_hidden">페이지 내비게이션</h2>
      <ul className="Pagination">
        {displayGoFirst && (
          <>
            <Button
              component={el}
              color="gray"
              outline
              className="Pagination_Button museoSans"
              aria-label="첫 페이지"
              {...getProps(1)}
            >
              처음
            </Button>
            <span className="Pagination_Dots">
              <Icon name="dotdotdot" className="Pagination_DeviderIcon" />
            </span>
          </>
        )}
        {displayGoPrev && (
          <Button
            component={el}
            color="gray"
            outline
            className="Pagination_Button museoSans"
            aria-label="이전 페이지"
            {...getProps(currentPage - 1)}
          >
            <Icon name="arrow_8_left" className="Pagination_GoPrevIcon" />
          </Button>
        )}
        <div className="Pagination_Group RUIGroup RUIGroup-horizontal">
          {pageNumbers.map((pageNumber) => (
            <Button
              component={el}
              className="Pagination_Button museoSans RUIGroup_Element"
              color={currentPage === pageNumber ? 'blue' : 'gray'}
              outline={!(currentPage === pageNumber)}
              aria-label={`${pageNumber} 페이지`}
              key={pageNumber}
              {...getProps(pageNumber)}
            >
              {pageNumber}
            </Button>
          ))}
        </div>
        {displayGoNext && (
          <Button
            component={el}
            color="gray"
            outline
            className="Pagination_Button museoSans"
            aria-label="다음 페이지"
            {...getProps(currentPage + 1)}
          >
            <Icon name="arrow_8_right" className="Pagination_GoNextIcon" />
          </Button>
        )}
      </ul>
    </nav>
  );
};
