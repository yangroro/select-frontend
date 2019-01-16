import { RidiSelectState } from 'app/store';
import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';

import {
  ConnectedInlineHorizontalBookList,
  DTOBookThumbnail,
} from 'app/components';
import { Book } from 'app/services/book';
import { SelectionId } from 'app/services/selection';
import { Actions, DefaultTrackingParams } from 'app/services/tracking';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { stringifyAuthors } from 'app/utils/utils';
import MediaQuery from 'react-responsive';
import { SliderControls } from './SliderControls';

interface HomeHotReleaseSectionProps {
  books: Book[];
  selectionId: SelectionId;
}

type Props = HomeHotReleaseSectionProps &
  ReturnType<typeof mapDispatchToProps>;

export class HomeHotReleaseSection extends React.Component<Props> {
  private slider: Slider;

  private setSliderImpression(sliderIdx: number) {
    const { books, trackImpression } = this.props;
    const section = getSectionStringForTracking('home', 'hot-release');

    const trackingStartIdx = sliderIdx > 0 ? sliderIdx * 5 - 1 : 0;
    const trackingEndIdx =
      trackingStartIdx + 5 > books.length ? books.length : trackingStartIdx + 5;

    for (let idx = trackingStartIdx; idx < trackingEndIdx; idx += 1) {
      books[idx] &&
        trackImpression({
          section,
          index: idx,
          id: books[idx].id,
        });
    }
  }

  public render() {
    const { books, trackClick, selectionId } = this.props;
    const section = getSectionStringForTracking('home', 'hot-release');
    return (
      <div className="HomeSection_HotRelease">
        <div className="HomeSection_HotRelease_Contents">
          <div className="HomeSection_HotRelease_Title">
            집 앞 서점에 방금 나온 신간!
            <img
              className="HomeSection_HotRelease_NewBadge"
              src="/assets/images/new-badge@2x.png"
              alt="NEW"
            />
          </div>
          <MediaQuery maxWidth={900}>
            {(isMobile) =>
              isMobile ? (
                <ConnectedInlineHorizontalBookList
                  books={books}
                  pageTitleForTracking="home"
                  uiPartTitleForTracking={selectionId.toString()}
                  renderAuthor={true}
                />
              ) : (
                <div className="HomeSection_HotRelease_Slider">
                  <Slider
                    ref={(slider: Slider) => (this.slider = slider)}
                    dots={true}
                    infinite={books.length > 5}
                    adaptiveHeight={false}
                    arrows={false}
                    speed={200}
                    slidesToShow={5}
                    slidesToScroll={5}
                    dotsClass="HotRelease_Navigator"
                    onInit={() => this.setSliderImpression(0)}
                    afterChange={(currentIdx) =>
                      this.setSliderImpression(currentIdx)
                    }
                  >
                    {books.map((book, idx) => (
                      <div
                        className="HomeSection_HotRelease_Book"
                        style={{
                          width: '165px',
                        }}
                        key={`hot-release-book-${idx}`}
                      >
                        <DTOBookThumbnail
                          book={book}
                          width={140}
                          linkUrl={`/book/${book.id}`}
                          linkType="Link"
                          onLinkClick={() =>
                            section &&
                            trackClick({
                              section,
                              index: idx,
                              id: book.id,
                            })
                          }
                          imageClassName="InlineHorizontalBookList_Thumbnail"
                          lazyload={true}
                        />
                        <Link
                          to={`/book/${book.id}`}
                          className="HomeSection_HotRelease_Book_Link"
                          onClick={() =>
                            section &&
                            trackClick({
                              section,
                              index: idx,
                              id: book.id,
                            })
                          }
                        >
                          <span className="HomeSection_HotRelease_Book_Title">
                            {book.title.main}
                          </span>
                          <span className="HomeSection_HotRelease_Book_Author">
                            {stringifyAuthors(book.authors, 2)}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </Slider>
                  {books.length > 5 && (
                    <SliderControls
                      onPrevClick={() => this.slider.slickPrev()}
                      onNextClick={() => this.slider.slickNext()}
                    />
                  )}
                </div>
              )
            }
          </MediaQuery>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  trackClick: (trackingParams: DefaultTrackingParams) => dispatch(Actions.trackClick({ trackingParams })),
  trackImpression: (trackingParams: DefaultTrackingParams) => dispatch(Actions.trackImpression({ trackingParams })),
});

export const ConnectedHomeHotReleaseSection = connect(
  null,
  mapDispatchToProps,
)(HomeHotReleaseSection);
