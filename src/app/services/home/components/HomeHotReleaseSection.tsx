import * as React from "react";
import { RidiSelectState } from "app/store";
import { connect } from "react-redux";
import Slider from "react-slick";
import { Link } from "react-router-dom";

import { ConnectedTrackImpression, DefaultTrackingParams, trackClick, ActionTrackClick } from 'app/services/tracking';
import { getSectionStringForTracking } from "app/services/tracking/utils";
import MediaQuery from "react-responsive";
import { ConnectedInlineHorizontalBookList, DTOBookThumbnail } from "app/components";
import { stringifyAuthors } from "app/utils/utils";
import { SliderControls } from "./SliderControls";
import { SelectionId } from "app/services/selection/actions";
import { Book } from "app/services/book";

interface HomeHotReleaseSectionProps {
  books: Book[];
  selectionId: SelectionId;
}

interface HomeHotReleaseSectionStateProps {
  BASE_URL_STATIC: string;
}

interface HomeHotReleaseSectionDispatchProps {
  trackClick: (params: DefaultTrackingParams) => ActionTrackClick;
}

type Props = HomeHotReleaseSectionProps & HomeHotReleaseSectionStateProps & HomeHotReleaseSectionDispatchProps;

export class HomeHotReleaseSection extends React.Component<Props> {
  private slider: Slider;

  public render() {
    const { books, trackClick, selectionId, BASE_URL_STATIC } = this.props;
    const section = getSectionStringForTracking('home', 'hot-release');
    return (
      <div className="HomeSection_HotRelease">
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
      </div>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): HomeHotReleaseSectionStateProps => {
  return {
    BASE_URL_STATIC: rootState.environment.constants.BASE_URL_STATIC,
  };
};

const mapDispatchToProps = (dispatch: any): HomeHotReleaseSectionDispatchProps => {;
  return {
    trackClick: (params: DefaultTrackingParams) => dispatch(trackClick(params)),
  };
};

export const ConnectedHomeHotReleaseSection = connect(mapStateToProps, mapDispatchToProps)(HomeHotReleaseSection);