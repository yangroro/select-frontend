import * as classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';
import MediaQuery from 'react-responsive';

import { Book } from 'app/services/book/reducer.state';
import { StarRating } from 'app/services/review/components';
import { DTOBookThumbnail } from 'app/components/DTOBookThumbnail';
import { ThumbnailLinkType, ThumbnailSize } from 'app/components/BookThumbnail';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import { ConnectedTrackImpression, DefaultTrackingParams, trackClick, ActionTrackClick } from 'app/services/tracking';
import { connect } from 'react-redux';
import { getSectionStringForTracking } from 'app/services/tracking/utils';

interface Props {
  books: Book[];
  pageTitleForTracking?: string;
  filterForTracking?: string;
  isChart?: boolean;
  page?: number;
  itemCountPerPage?: number;
  thumbnailLinkType?: ThumbnailLinkType;
  onLinkClick?: (event: React.SyntheticEvent<any>) => any;
}

interface DispatchProps {
  trackClick: (params: DefaultTrackingParams) => ActionTrackClick;
}

export class GridBookList extends React.Component<Props & DispatchProps>{
  renderItem = (width: ThumbnailSize, book: Book, rank: number, index: number) => {
    const {
      isChart = false,
      thumbnailLinkType = 'Link',
      onLinkClick = () => {},
      trackClick,
    } = this.props;

    const section = this.getSection();

    return <div style={{ width }}>
      {isChart && <span className="GridBookList_ItemRanking">{rank}</span>}
      <DTOBookThumbnail
        book={book}
        width={width}
        linkUrl={`/book/${book.id}`}
        linkType={thumbnailLinkType}
        onLinkClick={(e: React.MouseEvent<any>) => {
          onLinkClick(e);
          section && trackClick({
            section,
            index,
            id: book.id,
          });
        }}
        sizeWrapperClassName="GridBookList_ItemThumbnail"
      />
      <Link
        to={`/book/${book.id}`}
        className="GridBookList_ItemLink"
        onClick={(e: React.MouseEvent<any>) => {
          onLinkClick(e);
          section && trackClick({
            section,
            index,
            id: book.id,
          });
        }}
      >
        <h3 className="GridBookList_ItemTitle">{book.title.main}</h3>
        {isChart && (
          <span className="HomeSection_ChartBookRating">
            <StarRating rating={book.reviewSummary!.buyerRatingAverage} />
            <span className="HomeSection_ChartBookRatingCount">
              {thousandsSeperator(book.reviewSummary!.buyerRatingCount)}
            </span>
          </span>
        )}
      </Link>
    </div>
  }

  getSection = () => {
    const { pageTitleForTracking, filterForTracking } = this.props;
    return !!pageTitleForTracking ?
      getSectionStringForTracking(pageTitleForTracking, 'books', filterForTracking) :
      undefined;
  }

  getRank = (current: number) => {
    const { page = 1, itemCountPerPage = 24 } = this.props;
    return (current + 1) + (page - 1) * itemCountPerPage;
  }

  render() {
    const {
      books,
      isChart = false,
    } = this.props;

    return (
      <ul
        className={classNames([
          'GridBookList',
          isChart && 'GridBookList-isChart',
        ])}
      >
        {books.map((book, index) => (
          <li className="GridBookList_Item" key={book.id}>
            <ConnectedTrackImpression
              section={this.getSection()}
              index={index}
              id={book.id}
            >
              <MediaQuery maxWidth={359}>
                {this.renderItem(90, book, this.getRank(index), index)}
              </MediaQuery>
              <MediaQuery minWidth={360} maxWidth={413}>
                {this.renderItem(100, book, this.getRank(index), index)}
              </MediaQuery>
              <MediaQuery minWidth={414} maxWidth={767}>
                {this.renderItem(116, book, this.getRank(index), index)}
              </MediaQuery>
              <MediaQuery minWidth={768}>
                {this.renderItem(120, book, this.getRank(index), index)}
              </MediaQuery>
            </ConnectedTrackImpression>
          </li>
        ))}
      </ul>
    );
  }
};


const mapDispatchToProps = (dispatch: any): DispatchProps => {;
  return {
    trackClick: (params: DefaultTrackingParams) => dispatch(trackClick(params)),
  };
};

export const ConnectedGridBookList = connect(null, mapDispatchToProps)(GridBookList);

