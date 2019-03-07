import { setFixedScrollToTop } from 'app/utils/utils';
import * as React from 'react';
import { withRouter } from 'react-router';

interface ScrollManagerProps {
  location: Location;
  history: History & { action: string };
}

export class ScrollManager extends React.Component<ScrollManagerProps> {
  constructor(props: any) {
    super(props);
  }

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
    if (this.props.location === nextProps.location) {
      return true;
    }

    if (nextProps.history.action === 'PUSH') {
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
