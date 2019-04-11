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
}

export const HelmetWithTitle: React.SFC<HelmetWithTitleProps> = ({
  titleName = null,
  titleType = TitleType.POSTFIXED,
  meta = [],
}) => {
  let title = '리디셀렉트';
  if (titleName && titleType === TitleType.POSTFIXED) {
    title = `${titleName} - ${title}`;
  } else if (titleName && titleType === TitleType.PREFIXED) {
    title = `${title} - ${titleName}`;
  }
  return (
    <Helmet
      title={title}
      meta={meta}
    />
  );
};
