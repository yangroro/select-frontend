import { Icon } from '@ridi/rsg';
import * as classNames from 'classnames';
import * as React from 'react';
import MediaQuery from 'react-responsive';
import Slider from 'react-slick';
import { debounce } from 'lodash-es';
import { BigBanner } from 'app/services/home/reducer.state';
import { DefaultTrackingParams,trackImpression, ActionTrackClick, trackClick, ActionTrackImpression } from 'app/services/tracking';
import { connect } from 'react-redux';
import { getSectionStringForTracking } from 'app/services/tracking/utils';
import { ConnectedBigBannerItem } from './BigBannerItem';

const PC_BANNER_WIDTH = 432;
const PC_MIN_HEIGHT = 288;

interface BigBannerProps {
  items: BigBanner[];
}
interface DispatchProps {
  trackClick: (params: DefaultTrackingParams) => ActionTrackClick;
  trackImpression: (params: DefaultTrackingParams) => ActionTrackImpression;
}
interface State {
  clientWidth: number;
}

export class BigBannerCarousel extends React.Component<BigBannerProps & DispatchProps, State> {
  private static touchThereshold = 10;
  private slider: Slider;
  private wrapper: HTMLElement | null;
  private firstClientX: number;
  private sliderImpressionCheckTimeout?: number;

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

  private setSliderImpression(Idx: number) {
    const { items } = this.props;
    const section = getSectionStringForTracking('home', 'big-banner');
    this.sliderImpressionCheckTimeout && window.clearTimeout(this.sliderImpressionCheckTimeout);
    this.sliderImpressionCheckTimeout = window.setTimeout(() => trackImpression({
      section,
      index: Idx,
      id: items[Idx].id,
    }), 300);
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
    if (this.props.items.length === 0) {
      return null;
    }
    const { items, trackImpression, trackClick } = this.props;
    const section = getSectionStringForTracking('home', 'big-banner');
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
              onInit={() => this.setSliderImpression(0)}
              afterChange={(currentIdx) => this.setSliderImpression(currentIdx)}
              touchThreshold={BigBannerCarousel.touchThereshold}
              dotsClass="BigBanner_Dots"
            >
              {items.map((item, index) => (
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
            <div className="BigBanner_Controls">
              <button
                className="BigBanner_ControlButton"
                onClick={() => this.slider.slickPrev()}
                type="button"
              >
                <Icon name="arrow_5_left" className="BigBanner_ControlIcon" />
                <span className="a11y">이전 배너 보기</span>
              </button>
              <button
                className="BigBanner_ControlButton"
                onClick={() => this.slider.slickNext()}
                type="button"
              >
                <Icon name="arrow_5_right" className="BigBanner_ControlIcon" />
                <span className="a11y">다음 배너 보기</span>
              </button>
            </div>
          </section>
        )}
      </MediaQuery>
    );
  }
}

const mapDispatchToProps = (dispatch: any): DispatchProps => {;
  return {
    trackClick: (params: DefaultTrackingParams) => dispatch(trackClick(params)),
    trackImpression: (params: DefaultTrackingParams) => dispatch(trackImpression(params)),
  };
};

export const ConnectedBigBannerCarousel = connect(null, mapDispatchToProps)(BigBannerCarousel);
