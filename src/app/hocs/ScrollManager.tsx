import * as React from 'react';
import { withRouter } from 'react-router';
import { setFixedScrollToTop } from 'app/utils/utils';

interface ScrollManagerProps {
  location: Location;
}

interface ScrollManagerState {
  scrollPosition: {
    [location: string]: number
  };
}

export class ScrollManager extends React.Component<ScrollManagerProps, ScrollManagerState> {
  constructor(props: any) {
    super(props);
  }

  private scrollToTopSetter() {
    window.setTimeout(() => {
      setFixedScrollToTop(true);
      window.scrollTo(0, 0);
    });
  }

  public state: ScrollManagerState = {
    scrollPosition: {},
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
        }
      });
    }
    if (
      !scrollPosition[nextProps.location.pathname] ||
      scrollPosition[nextProps.location.pathname] === 0
    ) {
      this.scrollToTopSetter();
    }
    return true;
  }

  public componentDidMount() {
    window.setTimeout(() => setFixedScrollToTop(false), 300);
  }

  public componentDidUpdate() {
    const { location } = this.props;
    const { scrollPosition } = this.state;

    window.setTimeout(() => {
      if (scrollPosition[location.pathname]) {
        window.scrollTo(0, scrollPosition[location.pathname]);
      } else {
        setFixedScrollToTop(false);
      }
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
