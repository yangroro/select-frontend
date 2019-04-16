import { Icon } from '@ridi/rsg';
import * as React from 'react';

const { Fragment } = React;

export interface NoticeProps {
  type?: string;
  icon?: string;
  mainText: string;
  subText?: string;
  subTextType?: string;
}

export const Notice: React.SFC<NoticeProps> = (props) => {
  const { mainText, subText } = props;

  return (
    <div className={'Notice'}>
      <Icon name="exclamation_3" />
      <div className={'Notice_Main_Text'}>
      {mainText}
      { subText &&
        <span className={'Sub_Notice'}>
          <Icon name="won" />
          <span className={'Notice_Sub_Text'}>{subText}</span>
        </span>
      }
      </div>
    </div>
  );
};
