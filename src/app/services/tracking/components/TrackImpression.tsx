import * as React from 'react';
import { connect } from 'react-redux';
import { DefaultTrackingParams, trackImpression, ActionTrackImpression } from '../actions';
import { Omit } from 'app/types';
import { isInViewport } from '../isInViewport';
import { subscribeToScrollEnd, unsubscribeFromScrollEnd } from '../onWindowScrollEnd';

export interface TrackImpressionDispatchProps {
  trackImpression: (params: DefaultTrackingParams) => ActionTrackImpression;
}

export type TrackImpressionOwnProps = Omit<DefaultTrackingParams, 'section'> & {
  section?: string;
};

export type TrackImpressionProps = TrackImpressionDispatchProps & TrackImpressionOwnProps;

export class TrackImpression extends React.Component<TrackImpressionProps> {
  private ref: React.RefObject<HTMLDivElement>;
  private scrollEndHandlerIndex?: number;
  private initialCheckTimeout?: number;

  constructor(props: TrackImpressionProps) {
    super(props);
    this.ref = React.createRef();
  }

  trackEmpression = () => {
    const { trackImpression, section, index, id  } = this.props;
    if (!section) {
      return;
    }

    if (isInViewport(this.ref.current!) && this.ref.current!.clientHeight) {
      trackImpression({
        section,
        index,
        id
      });
      if (this.scrollEndHandlerIndex) {
        unsubscribeFromScrollEnd(this.scrollEndHandlerIndex);
        this.scrollEndHandlerIndex = undefined;
      }
    }
  }

  componentDidMount() {
    const { section } = this.props;
    if (!section || !this.ref.current) {
      return;
    }

    this.scrollEndHandlerIndex = subscribeToScrollEnd(this.trackEmpression);
    this.initialCheckTimeout = window.setTimeout(() => {
      this.trackEmpression();
    }, 300);
  }

  componentWillUnmount() {
    if (this.initialCheckTimeout) {
      window.clearTimeout(this.initialCheckTimeout);
    }
    if (this.scrollEndHandlerIndex) {
      unsubscribeFromScrollEnd(this.scrollEndHandlerIndex);
      this.scrollEndHandlerIndex = undefined;
    }
  }

  render() {
    return (
      <div
        className="pass-through"
        ref={this.ref}
      >
        {this.props.children}
      </div>
    );
  }
};

const mapDispatchToProps = (dispatch: any): TrackImpressionDispatchProps => {;
  return {
    trackImpression: (params: DefaultTrackingParams) => dispatch(trackImpression(params)),
  };
};

export const ConnectedTrackImpression = connect(null, mapDispatchToProps)(TrackImpression);
