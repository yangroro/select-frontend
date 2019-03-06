import { setFixedScrollToTop } from 'app/utils/utils';
import * as React from 'react';
import { withRouter } from 'react-router';

interface ScrollManagerProps {
  location: Location;
  history: History & { action: string };
}

interface ScrollManagerState {
  scrollPosition: {
    [location: string]: number,
  };
}

export class ScrollManager extends React.Component<ScrollManagerProps, ScrollManagerState> {
  constructor(props: any) {
    super(props);
  }

  public state: ScrollManagerState = {
    scrollPosition: {},
  };

  private scrollToTopSetter() {
    window.setTimeout(() => {
      setFixedScrollToTop(true);
      window.scrollTo(0, 0);
    });
  }

  public componentWillMount() {
    this.scrollToTopSetter();
  }

  public shouldComponentUpdate(nextProps: ScrollManagerProps) {
    const { location } = this.props;
    const { scrollPosition } = this.state;
    if (this.props.location === nextProps.location) {
      return true;
    }
    if (
      !scrollPosition[location.pathname] ||
      scrollPosition[location.pathname] !== window.scrollY
    ) {
      this.setState({
        scrollPosition: {
          ...scrollPosition,
          [location.pathname]: window.scrollY,
        },
      });
    }
    if (
      !scrollPosition[nextProps.location.pathname] ||
      scrollPosition[nextProps.location.pathname] === 0 ||
      nextProps.history.action === 'PUSH'
    ) {
      this.scrollToTopSetter();
    }

    return true;
  }

  public componentDidMount() {
    window.setTimeout(() => setFixedScrollToTop(false), 300);
  }

  public componentDidUpdate() {
    window.setTimeout(() => {
      setFixedScrollToTop(false);
    }, 300);
  }
  public componentWillUnmount() {
    window.setTimeout(() => setFixedScrollToTop(false), 300);
  }

  public render() {
    return this.props.children;
  }
}

export const ConnectedScrollManager = withRouter(ScrollManager);
