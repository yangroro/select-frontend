import { Button, Empty, Icon } from '@ridi/rsg';
import { ConnectedHelmetWithTitle } from 'app/components';
import { PageTitleText } from 'app/constants';
import * as React from 'react';
import { Link } from 'react-router-dom';

export class ExpiredBook extends React.Component {

  public render() {
    return (
      <main className="SceneWrapper">
        <ConnectedHelmetWithTitle titleName={PageTitleText.EXPIRED} />
        <section className="PageExpireBook">
          <Empty className={'Empty_HasButton'} description="이 책은 출판사 또는 저작권자의 요청으로 서비스가 중지되어 책 정보를 볼 수 없습니다." iconName="book_1" />
          <Link to={`/home`} className="MySelectBookList_Link">
            <Button
              color="blue"
              outline={true}
              className="PageSearchResult_RidibooksResult"
              size="large"
              style={{
                marginTop: '10px',
              }}
            >
              홈으로 바로가기
              <Icon
                name="arrow_5_right"
                className="PageSearchResult_RidibooksResultIcon"
              />
            </Button>
          </Link>
        </section>

      </main>
    );
  }
}
