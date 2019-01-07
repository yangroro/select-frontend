import * as React from "react";
import { RidiSelectState } from "app/store";
import { connect } from "react-redux";

import { ConnectedTrackImpression, DefaultTrackingParams, trackClick, ActionTrackClick } from 'app/services/tracking';
import { SectionHeader } from "./HomeSection";
import MediaQuery from "react-responsive";
import { getSectionStringForTracking } from "app/services/tracking/utils";
import { groupChartBooks } from 'app/services/home/uitls';
import { DTOBookThumbnail } from "app/components";
import { Link } from "react-router-dom";
import { StarRating } from "app/services/review";
import { thousandsSeperator } from "app/utils/thousandsSeperator";
import { Book } from "app/services/book";
import { SelectionId } from "app/services/selection/actions";

interface HomeChartBooksSectionProps {
  books: Book[];
  title: string;
  selectionId: SelectionId;
}

interface HomeChartBooksSectionDispatchProps {
  trackClick: (params: DefaultTrackingParams) => ActionTrackClick;
}

type Props = HomeChartBooksSectionProps & HomeChartBooksSectionDispatchProps;


export class HomeChartBooksSection extends React.Component<Props> {
  public renderCharts(contentsCount: number) {
    const { books, trackClick } = this.props;
    const section = getSectionStringForTracking('home', 'popular');
    return (
      <div className="HomeSection_Chart">
        {books
          .slice(0, contentsCount)
          .reduce(groupChartBooks(4), [])
          .map((groupedBooks, groupIdx) => (
            <ol className="HomeSection_ChartGroup" start={groupIdx * 4 + 1} key={groupIdx}>
              {groupedBooks.map((book, idxInGroup) => {
                const index = groupIdx * 4 + idxInGroup;
                return (
                  <li className="HomeSection_ChartBook" key={String(groupIdx) + idxInGroup}>
                    <ConnectedTrackImpression
                      section={section}
                      index={index}
                      id={book.id}
                    >
                      <span className="HomeSection_ChartBookRanking">
                        {index + 1}
                      </span>
                      <DTOBookThumbnail
                        book={book}
                        width={50}
                        linkUrl={`/book/${book.id}`}
                        linkType="Link"
                        onLinkClick={() => trackClick({
                          section,
                          index,
                          id: book.id,
                        })}
                        imageClassName="HomeSection_ChartBookThumbnail"
                        linkWrapperClassName="HomeSection_BookLink"
                      />
                      <Link
                        to={`/book/${book.id}`}
                        className="HomeSection_BookLink"
                        onClick={() => trackClick({
                          section,
                          index,
                          id: book.id,
                        })}
                      >
                        <div className="HomeSection_ChartBookMeta">
                          <span className="HomeSection_ChartBookTitle">{book.title.main}</span>
                          <span className="HomeSection_ChartBookRating">
                            <StarRating rating={book.reviewSummary!.buyerRatingAverage} />
                            <span className="HomeSection_ChartBookRatingCount">
                              {thousandsSeperator(book.reviewSummary!.buyerRatingCount)}
                            </span>
                          </span>
                        </div>
                      </Link>
                    </ConnectedTrackImpression>
                  </li>
                )}
              )}
            </ol>
          ))}
      </div>
    )
  }

  public render() {
    const { title } = this.props;

    return (
      <div className="HomeSection HomeSection-horizontal-pad">
        <SectionHeader title={title} link={'/charts'} />
        <MediaQuery maxWidth={840}>
          {(isMobile) => isMobile ? this.renderCharts(24) : this.renderCharts(12) }
        </MediaQuery>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any): HomeChartBooksSectionDispatchProps => {;
  return {
    trackClick: (params: DefaultTrackingParams) => dispatch(trackClick(params)),
  };
};

export const ConnectedHomeChartBooksSection = connect(null, mapDispatchToProps)(HomeChartBooksSection);