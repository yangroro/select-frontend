import * as React from 'react';

import { Icon } from '@ridi/rsg';
import { ReviewInvisibilityType } from 'app/services/review';

interface ReviewClosedProps {
  type: ReviewInvisibilityType;
}

export const ReviewClosed: React.SFC<ReviewClosedProps> = (props) => {
  const { type } = props;

  return (
    <div className="Review_Alert">
      <article className="Review_Alert_Article">
        <p className="Review_Alert_Description">
          <Icon
            className="Review_Alert_Icon"
            name="exclamation_2"
          />
          {type === ReviewInvisibilityType.admin ? (
            '건전한 리뷰 문화를 위해 비공개 되었습니다.'
          ) : (
            '리뷰에 신고가 지속적으로 접수되어 비공개 처리되었습니다.'
          )}
          <br/>
          <a
            className="Review_Alert_Button"
            type="button"
            href="https://ridibooks.com/support/notice/458"
            target="_blank"
          >
            리뷰 운영 정책 보기
          </a>
        </p>
      </article>
    </div>
  );
};
