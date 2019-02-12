import { inAppGnbRoutes } from 'app/routes';
import { ConnectedWebActionBar } from 'app/services/customHistory/components/WebActionBar';
import { getIsIosInApp, selectIsInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import { Location } from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { PageTitle } from './PageTitle';

export interface PageHeaderStateProps {
  isRidiApp: boolean;
  isIosInApp: boolean;
  location: Location;
}

export interface PageHeaderOwnProps {
  underline?: boolean;
  pageTitle?: string;
}

export type PageHeaderProps = PageHeaderStateProps & PageHeaderOwnProps;

export const PageHeader: React.SFC<PageHeaderProps> = ({
  isRidiApp,
  isIosInApp,
  location,
  underline,
  pageTitle,
  children,
}) => {
  if (isIosInApp || (!pageTitle && !children)) {
    return null;
  }

  if (isRidiApp && !inAppGnbRoutes.includes(location.pathname)) {
    return (
      <>
        {pageTitle && <ConnectedWebActionBar>{pageTitle}</ConnectedWebActionBar>}
        {!!children && <div className="PageHeader">{children}</div>}
      </>
    );
  }

  return (
    <div className="PageHeader">
      {pageTitle && <PageTitle underline={underline}>{pageTitle}</PageTitle>}
      {children}
    </div>
  );
};

const mapStateToProps = (rootState: RidiSelectState) => ({
  isRidiApp: selectIsInApp(rootState),
  isIosInApp: getIsIosInApp(rootState),
  location: rootState.router.location,
});

export const ConnectedPageHeader = connect(mapStateToProps)(PageHeader);
