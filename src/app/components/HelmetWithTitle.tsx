import { Actions } from 'app/services/commonUI';
import { RidiSelectState } from 'app/store';
import * as React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

export enum TitleType {
  PREFIXED,
  POSTFIXED,
}

interface HelmetWithTitleProps {
  titleName?: string | null;
  titleType?: TitleType;
  meta?: object[];
  currentTitle: string;
}

export const HelmetWithTitle: React.SFC<HelmetWithTitleProps & ReturnType<typeof mapDispatchToProps>> = ({
  titleName = null,
  titleType = TitleType.POSTFIXED,
  meta = [],
  currentTitle,
  updateCurrentTitle,
}) => {
  let title = '리디셀렉트';
  if (titleName && titleType === TitleType.POSTFIXED) {
    title = `${titleName} - ${title}`;
  } else if (titleName && titleType === TitleType.PREFIXED) {
    title = `${title} - ${titleName}`;
  }
  if (currentTitle !== titleName) {
    updateCurrentTitle(titleName ? titleName : '리디셀렉트');
  }
  return (
    <Helmet
      title={title}
      meta={meta}
    />
  );
};

const mapStateToProps = (rootState: RidiSelectState) => ({
  currentTitle: rootState.commonUI.currentTitle,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    updateCurrentTitle: (title: string) => dispatch(Actions.updateCurrentTitle({ title })),
  };
};

export const ConnectedHelmetWithTitle = connect(mapStateToProps, mapDispatchToProps)(HelmetWithTitle);
