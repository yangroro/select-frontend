import { inAppGnbRoutes } from 'app/routes';
import { ConnectedWebActionBar } from 'app/services/customHistory/components/WebActionBar';
import { getIsAndroidInApp, getIsIosInApp, selectIsInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import { Location } from 'history';
import * as React from 'react';
import { connect } from 'react-redux';
import { PageTitle } from './PageTitle';

export interface PageHeaderStateProps {
  isIosInApp: boolean;
  isAndroidInApp: boolean;
  location: Location;
}

export interface PageHeaderOwnProps {
  underline?: boolean;
  pageTitle?: string;
}

export type PageHeaderProps = PageHeaderStateProps & PageHeaderOwnProps;

export const PageHeader: React.SFC<PageHeaderProps> = ({
  isIosInApp,
  isAndroidInApp,
  location,
  underline,
  pageTitle,
  children,
}) => {
  if (isIosInApp || (!pageTitle && !children)) {
    return null;
  }

  if (isAndroidInApp && !inAppGnbRoutes.includes(location.pathname)) {
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
  isIosInApp: getIsIosInApp(rootState),
  isAndroidInApp: getIsAndroidInApp(rootState),
  location: rootState.router.location,
});

export const ConnectedPageHeader = connect(mapStateToProps)(PageHeader);
