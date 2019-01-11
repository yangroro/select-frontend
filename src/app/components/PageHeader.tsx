import * as React from 'react';
import { RidiSelectState } from 'app/store';
import { connect } from 'react-redux';
import { ConnectedWebActionBar } from 'app/services/customHistory/components/WebActionBar';
import { PageTitle } from './PageTitle';
import { inAppGnbRoutes } from 'app/routes';
import { Location } from 'history';

export interface PageHeaderStateProps {
  isRidiApp: boolean;
  location: Location;
}

export interface PageHeaderOwnProps {
  underline?: boolean;
  pageTitle?: string;
}

export type PageHeaderProps = PageHeaderStateProps & PageHeaderOwnProps;

export const PageHeader: React.SFC<PageHeaderProps> = ({
  isRidiApp,
  location,
  underline,
  pageTitle,
  children
}) => {
  if (!pageTitle && !children) {
    return null;
  }

  if (isRidiApp && !inAppGnbRoutes.includes(location.pathname)) {
    return <>
      {pageTitle && <ConnectedWebActionBar>{pageTitle}</ConnectedWebActionBar>}
      {!!children && <div className="PageHeader">{children}</div>}
    </>;
  }

  return (
    <div className="PageHeader">
      {pageTitle && <PageTitle underline={underline}>{pageTitle}</PageTitle>}
      {children}
    </div>
  );
};

const mapStateToProps = (rootState: RidiSelectState) => ({
  isRidiApp: rootState.environment.platform.isRidibooks,
  location: rootState.router.location,
});

export const ConnectedPageHeader = connect(mapStateToProps)(PageHeader);
