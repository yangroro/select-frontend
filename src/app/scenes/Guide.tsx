// tslint:disable:max-line-length

import * as React from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

import { Button } from '@ridi/rsg/components/dist/button';
import { Icon } from '@ridi/rsg/components/dist/icon';
import { ConnectedPageHeader } from 'app/components';
import { RidiSelectState } from 'app/store';

interface GuideProps {
  BASE_URL_STATIC: string;
  BASE_URL_STORE: string;
  FREE_PROMOTION_MONTHS: number;
}

export const Guide: React.SFC<GuideProps> = ({ BASE_URL_STATIC, BASE_URL_STORE, FREE_PROMOTION_MONTHS }) => {
  return (
    <main className="SceneWrapper Guide">
      <Helmet>
        <title>이용 방법 - 리디셀렉트</title>
      </Helmet>
      <ConnectedPageHeader underline={true} pageTitle="이용 방법" />
      <article className="Guide_Content">
        <ol className="Guide_List">
          <li className="Guide_Item">
            <h2 className="Guide_Item_Title">1. 리디북스 아이디로 로그인</h2>
            <p className="Guide_Item_Content grid">
              <span className="Guide_Item_Content_Left">
                리디셀렉트는 리디북스 아이디로 이용하실 수 있습니다. 아직 회원가입을 하지 않으신 고객님께서는 먼저 가입 후 로그인 해주세요.
              </span>
              <span className="Guide_Item_Content_Right">
                <img
                  className="Guide_Image"
                  src={`${BASE_URL_STATIC}/dist/images/guide/guide_ridibooks.jpg`}
                  alt=""
                />
                <Button
                  component="a"
                  href={`${BASE_URL_STORE}/account/oauth-authorize?fallback=signup&return_url=${location.href}`}
                  size="large"
                  thickBorderWidth={true}
                  outline={true}
                  className="Guide_FullButton"
                >
                  회원가입
                </Button>
              </span>
            </p>
          </li>
          <li className="Guide_Item">
            <h2 className="Guide_Item_Title">2. {FREE_PROMOTION_MONTHS}개월 무료로 읽어보기 &amp; 카드 등록</h2>
            <p className="Guide_Item_Content">
              카드 등록 후 리디셀렉트를 이용할 수 있습니다.<br/>
              신용카드, 체크카드 모두 등록할 수 있습니다.
              <MediaQuery minWidth={841}><br/><br/><br/></MediaQuery>
              <img
                className="Guide_Image"
                src={`${BASE_URL_STATIC}/dist/images/guide/guide_home_${FREE_PROMOTION_MONTHS}.jpg`}
                alt=""
              />
            </p>
          </li>
          <li className="Guide_Item">
            <h2 className="Guide_Item_Title">3. 마이 셀렉트에 책 추가</h2>
            <p className="Guide_Item_Content">
              마이 셀렉트에 무제한으로 책을 추가할 수 있으며, 추가한 책은 뷰어/앱 구매 목록에서 확인할 수 있습니다.
              <img
                className="Guide_Image"
                src={`${BASE_URL_STATIC}/dist/images/guide/guide_detail.jpg`}
                alt=""
              />
            </p>
          </li>
          <li className="Guide_Item">
            <h2 className="Guide_Item_Title">4. 뷰어 다운로드</h2>
            <div className="Guide_Item_Content">
              리디북스 뷰어/앱을 다운로드해주세요.
              <figure className="Guide_AppDownloadIcon_Figure">
                <Icon
                  className="Guide_AppDownloadIcon"
                  name="app_ridi_1"
                />
                <figcaption className="Guide_AppDownloadIcon_Caption">
                 iPhone, iPad, Android 스마트폰/태블릿,<br/>
                 mac OS/Windows PC 지원
                </figcaption>
              </figure>

              <Button
                component="a"
                href="https://ridibooks.com/support/app/download"
                target="_blank"
                size="large"
                thickBorderWidth={true}
                outline={true}
                className="Guide_FullButton"
              >
                뷰어 다운로드
              </Button>
            </div>
          </li>
          <li className="Guide_Item">
            <h2 className="Guide_Item_Title">5. 책 다운로드</h2>
            <p className="Guide_Item_Content">
              뷰어/앱 실행 후 구매 목록 탭에서 책을 다운로드해주세요.
              <img
                className="Guide_Image"
                src={`${BASE_URL_STATIC}/dist/images/guide/guide_download.jpg`}
                alt=""
              />
            </p>
          </li>
        </ol>
        <div className="Guide_FAQ">
          <h2 className="Guide_FAQ_Content">
            더 궁금하신 점이 있으시면 FAQ를 확인해보세요!
          </h2>
          <Button
            component="a"
            href="https://help.ridibooks.com/hc/ko/categories/360000139267"
            target="_blank"
            size="large"
            thickBorderWidth={true}
            outline={true}
            className="Guide_FullButton"
          >
            FAQ 보기
            <Icon
              className="Guide_FAQ_ArrowIcon"
              name="arrow_5_right"
            />
          </Button>
        </div>
      </article>
    </main>
  );
};

const mapStateToProps = (rootState: RidiSelectState) => ({
  BASE_URL_STATIC: rootState.environment.constants.BASE_URL_STATIC,
  BASE_URL_STORE: rootState.environment.constants.BASE_URL_STORE,
  FREE_PROMOTION_MONTHS: rootState.environment.constants.FREE_PROMOTION_MONTHS,
});

export const ConnectedGuide = connect(mapStateToProps)(Guide);
