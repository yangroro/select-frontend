import * as React from 'react';

import { ReviewInvisibilityType } from 'app/services/review';

interface ReviewClosedProps {
  type: ReviewInvisibilityType;
}

export const ReviewClosed: React.SFC<ReviewClosedProps> = (props) => {
  const { type } = props;

  return (
    <div className="rui_full_alert_4 Review_Alert">
      <article className="alert_article">
        <p className="alert_description">
          <span className="alert_icon Review_Alert_Icon" />
          {type === ReviewInvisibilityType.admin ? (
            '건전한 리뷰 문화를 위해 비공개 되었습니다.'
          ) : (
            '리뷰에 신고가 지속적으로 접수되어 비공개 처리되었습니다.'
          )}
          <br/>
          <a
            className="alert_detail_link Review_Alert_Button"
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
