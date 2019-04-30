import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Tab, Tabs } from '@ridi/rsg';

import { ConnectedPageHeader, HelmetWithTitle } from 'app/components';
import { PageTitleText } from 'app/constants';
import { ClosingReservedBooksTermState } from 'app/services/closingReservedBooks';
import { closingReservedTermType } from 'app/services/closingReservedBooks/requests';
import { RidiSelectState } from 'app/store';
import { RouteComponentProps, RouteProps, withRouter } from 'react-router';

interface State {
  isInitialized: boolean;
}

interface ClosingReservedBooksStateProps {
  closingReservedBooks: ClosingReservedBooksTermState;
}

type OwnProps = RouteComponentProps<{}>;
type Props = ClosingReservedBooksStateProps & OwnProps;

export class ClosingReservedBooks extends React.Component<Props> {
  private initialDispatchTimeout?: number | null;
  public state: State = {
    isInitialized: false,
  };

  private isFetched = (page: number) => {
    const { closingReservedBooks } = this.props;
  }

  public renderTermText(term: closingReservedTermType) {
    const currentDateObj = new Date();
    return `${
      currentDateObj.getFullYear()
    }년 ${
      term === 'thisMonth' ? currentDateObj.getMonth() + 1 : currentDateObj.getMonth() + 2
    }월`;
  }

  public render() {
    return (
      <main className="SceneWrapper">
        <HelmetWithTitle titleName={PageTitleText.CLOSING_RESERVED_BOOKS} />
        <ConnectedPageHeader pageTitle={PageTitleText.CLOSING_RESERVED_BOOKS} />
        <Tabs className="ClosingReservedBooks_Tabs">
          <Tab className="ClosingReservedBooks_Tab">{this.renderTermText('thisMonth')}</Tab>
          <Tab className="ClosingReservedBooks_Tab">{this.renderTermText('nextMonth')}</Tab>
        </Tabs>
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState): ClosingReservedBooksStateProps => {
  return {
    closingReservedBooks: rootState.closingReservedBooks.thisMonth,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {

};

export const ConnectedClosingReservedBooks = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ClosingReservedBooks),
);
