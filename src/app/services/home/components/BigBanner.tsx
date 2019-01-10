import { Icon } from '@ridi/rsg';
import * as classNames from 'classnames';
import * as React from 'react';
import MediaQuery from 'react-responsive';
import Slider from 'react-slick';
import { debounce } from 'lodash-es';
import { BigBanner } from 'app/services/home/reducer.state';
import { DefaultTrackingParams, ActionTrackClick, trackClick, ActionTrackImpression, trackImpression } from 'app/services/tracking';
import { connect } from 'react-redux';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { ConnectedBigBannerItem } from './BigBannerItem';
import { SliderControls } from './SliderControls';
import { RidiSelectState } from 'app/store';
import { BigBannerPlaceholder } from 'app/placeholder/BigBannerPlaceholder';

const PC_BANNER_WIDTH = 432;
const PC_MIN_HEIGHT = 288;

interface BigBannerStateProps {
  fetchedAt: number | null;
  bigBannerList: BigBanner[];
}

interface DispatchProps {
  trackClick: (params: DefaultTrackingParams) => ActionTrackClick;
  trackImpression: (params: DefaultTrackingParams) => ActionTrackImpression;
}

type Props = BigBannerStateProps & DispatchProps;

interface State {
  clientWidth: number;
}

export class BigBannerCarousel extends React.Component<Props, State> {
  private static touchThereshold = 10;
  private slider: Slider;
  private wrapper: HTMLElement | null;
  private firstClientX: number;

  public state: State = {
    clientWidth: 360,
  }

  private handleTouchStart = (e: TouchEvent) => {
    this.firstClientX = e.touches[0].clientX;
  }

  private preventTouch = (e: TouchEvent) => {
    const clientX = e.touches[0].clientX - this.firstClientX;
    const horizontalScroll = Math.abs(clientX) > BigBannerCarousel.touchThereshold;
    if (horizontalScroll) {
      e.preventDefault();
    }
  }

  public componentWillMount() {
    this.updateClientWidth();
  }

  private handleWindowResize = debounce(() => {
    this.updateClientWidth();
  }, 100)

  private updateClientWidth = () => {
    const { clientWidth } = document.body;
    if (this.state.clientWidth !== clientWidth) {
      this.setState({ clientWidth });
    }
  }

  private setSliderImpression (section: string, Idx: number) {
    const { trackImpression, bigBannerList } = this.props;

    trackImpression({
      section,
      index: Idx,
      id: bigBannerList[Idx].id,
    });
  }

  public componentDidMount() {
    if (this.wrapper) {
      this.wrapper.addEventListener('touchstart', this.handleTouchStart);
      this.wrapper.addEventListener('touchmove', this.preventTouch, { passive: false });
      window.addEventListener('resize', this.handleWindowResize);
    }
  }

  public componentWillUnmount() {
    if (this.wrapper) {
      this.wrapper.removeEventListener('touchstart', this.handleTouchStart);
      this.wrapper.removeEventListener('touchmove', this.preventTouch);
      window.removeEventListener('resize', this.handleWindowResize);
    }
  }

  public render() {
    const { fetchedAt, bigBannerList, trackClick } = this.props;
    const section = getSectionStringForTracking('home', 'big-banner');
    if (!fetchedAt || bigBannerList.length === 0) {
      return (<BigBannerPlaceholder />);
    }

    return (
      <MediaQuery maxWidth={432}>
        {(isMobile) => (
          <section
            ref={(wrapper) => this.wrapper = wrapper}
            className={classNames(['BigBanner', isMobile && 'BigBanner-isMobile'])}
            style={{
              maxHeight: isMobile ? Math.ceil(this.state.clientWidth * 0.7) : PC_MIN_HEIGHT,
              overflow: 'hidden',
            }}
          >
            <h2 className="a11y">메인 배너</h2>
            <Slider
              ref={(slider: Slider) => this.slider = slider}
              dots={true}
              infinite={true}
              adaptiveHeight={false}
              arrows={false}
              centerMode={!isMobile}
              variableWidth={!isMobile}
              draggable={isMobile}
              speed={200}
              slidesToShow={1}
              slidesToScroll={1}
              onInit={() => this.setSliderImpression(section, 0)}
              afterChange={(currentIdx) => this.setSliderImpression(section, currentIdx)}
              touchThreshold={BigBannerCarousel.touchThereshold}
              dotsClass="BigBanner_Dots"
            >
              {bigBannerList.map((item, index) => (
                <ConnectedBigBannerItem
                  linkUrl={item.linkUrl}
                  onClick={() => trackClick({
                    section,
                    index: index,
                    id: item.id,
                  })}
                  key={index}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{
                      width: isMobile ? '100%' : PC_BANNER_WIDTH,
                      height: isMobile? '100%' : 'auto',
                      margin: !isMobile ? '0 1px' : 0,
                    }}
                  />
                  <span className="a11y">배너 링크</span>
                </ConnectedBigBannerItem>
              ))}
            </Slider>
            <SliderControls
              onPrevClick={() => this.slider.slickPrev()}
              onNextClick={() => this.slider.slickNext()}
            />
          </section>
        )}
      </MediaQuery>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): BigBannerStateProps => {
  return {
    fetchedAt: state.home.fetchedAt,
    bigBannerList: state.home.bigBannerList,
  }
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
  return {
    trackClick: (params: DefaultTrackingParams) => dispatch(trackClick(params)),
    trackImpression: (params: DefaultTrackingParams) => dispatch(trackImpression(params)),
  };
};

export const ConnectedBigBannerCarousel = connect(mapStateToProps, mapDispatchToProps)(BigBannerCarousel);
