import { Icon } from '@ridi/rsg';
import * as React from 'react';

export interface NoticeProps {
  type?: string;
  icon?: string;
  mainText: string;
  subText?: string;
  subTextType?: string;
  detailLink?: string;
}

export const Notice: React.SFC<NoticeProps> = (props) => {
  const { mainText, subText, detailLink } = props;

  return (
    <div className="Notice">
      <Icon className="RSGIcon-info" name="exclamation_3" />
      <div
        className="Notice_ContentWrapper"
      >
        <p
          className="Notice_Main_Text"
          dangerouslySetInnerHTML={{ __html: mainText}}
        />
        {subText &&
          <span className="Sub_Notice">
            <span
              className="Notice_Sub_Text"
              dangerouslySetInnerHTML={{ __html: subText }}
            />
          </span>
        }
        {detailLink &&
          <a className="Notice_DetailLink" href={detailLink}>
            자세히 보기 <Icon className="Notice_DetailLink_Icon" name="arrow_2_right" />
          </a>
        }
      </div>
    </div>
  );
};
