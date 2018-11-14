import * as classNames from 'classnames';
import * as React from 'react';
import { Popup, Icon, Button } from '@ridi/rsg';

export interface UnsubscribeWarningPopupProps {
  active: boolean;
  closeFunc: () => void;
  moveToNewReleaseFunc: () => void;
  unsubscribeFunc: () => void;
}

export const UnsubscribeWarningPopup: React.SFC<UnsubscribeWarningPopupProps> = (props) => {
  return (
    <Popup
      title="구독 해지 예약"
      active={props.active}
      onCancel={props.closeFunc}
      bodyHeight={246}
    >
      <p className="UnsubscribeWarningPopup_Title">
        <Icon
          className="Warning_Icon"
          name="exclamation_3"
        />
        매주 새로운 책이 추가되고 있습니다.
      </p>
      <p className="UnsubscribeWarningPopup_Text">
        매주 50여권의 책이 새로 추가되고 있습니다.<br />
        그래도 해지를 예약하시겠습니까?
      </p>
      <div className="UnsubscribeWarningPopup_ButtonGroup">
        <Button
          className="MoveToNewRelease_Button"
          color="blue"
          size="large"
          onClick={props.moveToNewReleaseFunc}
        >
          최신 업데이트 보기
        </Button>
        <Button
          className="Unsubscribe_Button"
          color="gray"
          outline={true}
          size="large"
          onClick={props.unsubscribeFunc}
        >
          구독 해지 예약하기
        </Button>
      </div>
    </Popup>
  );
};
