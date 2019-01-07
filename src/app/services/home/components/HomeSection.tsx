import * as React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import { Icon } from '@ridi/rsg';

import { ConnectedInlineHorizontalBookList } from 'app/components/InlineHorizontalBookList';
import { Book } from 'app/services/book/reducer.state';
import { SelectionType } from 'app/services/home';
import { StarRating } from 'app/services/review/components';
import { SelectionId } from 'app/services/selection/actions';
import { DTOBookThumbnail } from 'app/components/DTOBookThumbnail';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import { groupChartBooks } from 'app/services/home/uitls';
import { ConnectedTrackImpression, DefaultTrackingParams, trackClick, ActionTrackClick } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { SliderControls } from './SliderControls';
import { stringifyAuthors } from 'app/utils/utils';
import { RidiSelectState } from 'app/store';

interface HomeSectionStateProps {
  BASE_URL_STATIC: string;
}

interface HomeSectionProps {
  books: Book[];
  title: string;
  type: SelectionType;
  selectionId: SelectionId;
}

interface DispatchProps {
  trackClick: (params: DefaultTrackingParams) => ActionTrackClick;
}

const SectionHeader: React.SFC<{ title: string; link: string }> = (props) => {
  return (
    <div className="HomeSection_Header">
      <MediaQuery maxWidth={840}>
        {(isMobile) =>
          isMobile ? (
            <Link to={props.link}>
              <h2 className="HomeSection_Title reset-heading">
                {props.title}
                <Icon name="arrow_5_right" className="HomeSection_TitleArrowIcon" />
              </h2>
            </Link>
          ) : (
            <div className="HomeSection_Title">
              <h2 className="reset-heading">{props.title}</h2>
              {/* TODO: This class name is weird */}
              <Link to={props.link} className="HomeSection_TitleLink">
                전체 보기
                <Icon name="arrow_5_right" className="HomeSection_TitleArrowIcon" />
              </Link>
            </div>
          )
        }
      </MediaQuery>
    </div>
  );
};

export class HomeSection extends React.Component<HomeSectionProps & DispatchProps & HomeSectionStateProps> {
  private slider: Slider;

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

  private renderHotReleases() {
    const { books, trackClick, selectionId, BASE_URL_STATIC } = this.props;
    const section = getSectionStringForTracking('home', 'hot-release');
    return (
      <div className="HomeSection_HotRelease_Contents">
        <div className="HomeSection_HotRelease_Title">
          집 앞 서점에 방금 나온 신간!
          <img
            className="HomeSection_HotRelease_NewBadge"
            src={`${BASE_URL_STATIC}/dist/images/new-badge@2x.png`}
            alt="NEW"
          />
        </div>
        <MediaQuery maxWidth={840}>
          {(isMobile) => isMobile ? (
            <ConnectedInlineHorizontalBookList
              books={books}
              pageTitleForTracking="home"
              uiPartTitleForTracking={selectionId.toString()}
              renderAuthor={true}
              renderCategory={true}
            />
          ) : (
            <div className="HomeSection_HotRelease_Slider">
              <Slider
                ref={(slider: Slider) => this.slider = slider}
                dots={false}
                infinite={true}
                adaptiveHeight={false}
                arrows={false}
                speed={200}
                slidesToShow={5}
                slidesToScroll={5}
              >
                {books.map((book, idx) => (
                  <ConnectedTrackImpression
                    section={section}
                    index={idx}
                    id={book.id}
                    key={`hot-release-book-${idx}`}
                  >
                    <div
                      className="HomeSection_HotRelease_Book"
                      style={{
                        width: '140px',
                        margin: '0 auto'
                      }}
                    >
                      <DTOBookThumbnail
                        book={book}
                        width={140}
                        linkUrl={`/book/${book.id}`}
                        linkType="Link"
                        onLinkClick={() => section && trackClick({
                          section,
                          index: idx,
                          id: book.id,
                        })}
                        imageClassName="InlineHorizontalBookList_Thumbnail"
                        lazyload={true}
                      />
                      <Link
                        to={`/book/${book.id}`}
                        className="HomeSection_HotRelease_Book_Link"
                        onClick={() => section && trackClick({
                          section,
                          index: idx,
                          id: book.id,
                        })}
                      >
                        <span className="HomeSection_HotRelease_Book_Category">
                          {/* TODO: 데이터 받아서 하도록 변경 */}
                          카테고리
                        </span>
                        <span className="HomeSection_HotRelease_Book_Title">
                          {book.title.main}
                        </span>
                        <span className="HomeSection_HotRelease_Book_Author">
                          {stringifyAuthors(book.authors, 2)}
                        </span>
                      </Link>
                    </div>
                  </ConnectedTrackImpression>
                ))}
              </Slider>
              <SliderControls
                onPrevClick={() => this.slider.slickPrev()}
                onNextClick={() => this.slider.slickNext()}
              />
            </div>
          )}
        </MediaQuery>
      </div>
    );
  }

  public render() {
    const { books, title, type, selectionId } = this.props;
    if (type === SelectionType.HOT_RELEASE) {
      return (
        <div className="HomeSection_HotRelease">
          {this.renderHotReleases()}
        </div>
      )
    }

    if (type === SelectionType.CHART) {
      return (
        <div className="HomeSection HomeSection-horizontal-pad">
          <SectionHeader title={title} link={'/charts'} />
          <MediaQuery maxWidth={840}>
            {(isMobile) => isMobile ? this.renderCharts(24) : this.renderCharts(12) }
          </MediaQuery>
        </div>
      );
    }

    return (
      <section className="HomeSection">
        <SectionHeader title={title} link={`/selection/${selectionId}`} />
        <ConnectedInlineHorizontalBookList
          books={books}
          pageTitleForTracking="home"
          uiPartTitleForTracking={selectionId.toString()}
        />
      </section>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): HomeSectionStateProps => {
  return {
    BASE_URL_STATIC: rootState.environment.constants.BASE_URL_STATIC,
  };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {;
  return {
    trackClick: (params: DefaultTrackingParams) => dispatch(trackClick(params)),
  };
};

export const ConnectedHomeSection = connect(mapStateToProps, mapDispatchToProps)(HomeSection);
