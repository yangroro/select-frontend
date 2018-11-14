import * as React from 'react';

export interface ReviewSpoilerAlertProps {
  onButtonClick: () => void;
}

export const ReviewSpoilerAlert: React.SFC<ReviewSpoilerAlertProps> = (props) => {
  const { onButtonClick } = props;

  return (
    <div className="rui_full_alert_4 Review_Alert">
      <article className="alert_article">
        <p className="alert_description">
          <span className="alert_icon Review_Alert_Icon" />
          스포일러가 있는 리뷰입니다.<br/>
          <button
            className="alert_detail_link Review_Alert_Button"
            type="button"
            onClick={onButtonClick}
          >
            리뷰 보기
          </button>
        </p>
      </article>
    </div>
  );
};
