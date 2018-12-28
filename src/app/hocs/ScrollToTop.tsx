import * as React from 'react';
import { withRouter } from 'react-router';
import { setFixedScrollToTop } from 'app/utils/utils';

interface ScrollToTopProps {
  location: Location;
}

export class ScrollToTop extends React.Component<ScrollToTopProps> {
  constructor(props: any) {
    super(props);
  }

  public componentWillMount() {
    window.setTimeout(() => {
      setFixedScrollToTop(true);
      window.scrollTo(0, 0);
    }, 100);
  }

  public shouldComponentUpdate(nextProps: ScrollToTopProps) {
    if (this.props.location !== nextProps.location) {
      window.setTimeout(() => {
        setFixedScrollToTop(true);
        window.scrollTo(0, 0);
      }, 100);
    }
    return true;
  }

  public componentDidMount() {
    window.setTimeout(() => setFixedScrollToTop(false), 500);
  }

  public componentDidUpdate() {
    window.setTimeout(() => setFixedScrollToTop(false), 500);
  }

  public render() {
    return this.props.children;
  }
}

export const ConnectedScrollToTop = withRouter(ScrollToTop);
