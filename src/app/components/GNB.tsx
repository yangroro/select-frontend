import * as classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@ridi/rsg';
import { ConnectedSearch } from 'app/components/Search';
import { GNBColorLevel } from 'app/services/commonUI';
import { getBackgroundColorRGBString, getGNBType, getSolidBackgroundColorRGBString } from 'app/services/commonUI/selectors';
import { getIsInAppRoot, getIsIosInApp, getIsIosInAppHome, selectIsInApp } from 'app/services/environment/selectors';
import { RidiSelectState } from 'app/store';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';

interface Props {
  gnbType: GNBColorLevel;
  solidBackgroundColorRGBString: string;
  backgroundColorRGBString: string;
  BASE_URL_STORE: string;
  BASE_URL_RIDISELECT: string;
  isInApp: boolean;
  isIosInApp: boolean;
  isLoggedIn: boolean;
  isInAppRoot: boolean;
  isIosInAppHome: boolean;
  isSubscribing: boolean;
}

export const GNB: React.SFC<Props> = (props) => {
  const {
    gnbType,
    solidBackgroundColorRGBString,
    backgroundColorRGBString,
    isInApp,
    isIosInApp,
    isInAppRoot,
    isIosInAppHome,
    isLoggedIn,
    isSubscribing,
    BASE_URL_STORE,
    BASE_URL_RIDISELECT,
  } = props;

  if (!isIosInAppHome) {
    return null;
  }

  const Logo = (
    <>
      <Icon
        name="logo_ridiselect_1"
        className={classNames(
          'GNBLogo',
          isInAppRoot ? 'GNBLogo-InAppIntro' : null,
        )}
      />
      <h1 className="a11y">리디셀렉트</h1>
    </>
  );

  return (
    <header
      className={classNames(
        'GNBWrapper',
        `GNBWrapper-${gnbType}`,
      )}
      style={{ backgroundColor: backgroundColorRGBString }}
    >
      <div className="GNBContentWrapper">
        <div className="GNBLeft">
          {!isInAppRoot ?
            <Link className="GNBLogoWrapper" to="/home">{Logo}</Link> :
            <div className="GNBLogoWrapper">{Logo}</div>
          }
          {!isInApp &&
            <ul className="GNBServiceList">
              <li className="GNBService">
                <a
                  className="GNBServiceLink Ridibooks_Link"
                  href={`${ BASE_URL_STORE }`}
                >
                  <Icon
                    name="logo_ridibooks_1"
                    className="GNBServiceLogo RidibooksLogo"
                  />
                  <h2 className="a11y">리디북스</h2>
                </a>
              </li>
            </ul>
          }
        </div>
        {!isInAppRoot && <div className="GNBRight">
          {isLoggedIn && isSubscribing && (
            <>
              <MediaQuery maxWidth={840}>
                {(matches) => <ConnectedSearch isMobile={matches} />}
              </MediaQuery>
              <div className="GNBRightButtonWrapper">
                <Link className="GNBSettingButton" to="/settings">
                  <h2 className="a11y">셀렉트 관리</h2>
                  {isIosInApp ? (
                    // TODO: iosInApp 용 아이콘. 이 외에 사용할 곳이 없어서 별도로 처리할지? 그냥 둘지?
                    <svg className="SettingIcon_IosInApp" width="24px" height="24px" viewBox="0 0 24 24">
                      <g transform="translate(2.000000, 2.000000)" stroke="#339CF2" stroke-width="1.5" fill="none" fill-rule="evenodd">
                        {/* tslint:disable-next-line:max-line-length */}
                        <path d="M10,10.36125 C12.6597033,10.36125 14.8054167,8.21520292 14.8054167,5.55541667 C14.8054167,2.89572751 12.6598004,0.75 10,0.75 C7.34029668,0.75 5.19458333,2.89604708 5.19458333,5.55583333 C5.19458333,8.21552249 7.34019961,10.36125 10,10.36125 Z M0.75,19.25 L19.25,19.25 L19.25,18.5 C19.25,16.2421197 14.1100323,14.0833333 10,14.0833333 C5.88996766,14.0833333 0.75,16.2421197 0.75,18.5 L0.75,19.25 Z" />
                      </g>
                    </svg>
                  ) : (
                    <Icon
                      className="SettingIcon"
                      name="account_1"
                    />
                  )}
                </Link>
              </div>
            </>
          )}
          {isLoggedIn && !isSubscribing && (
            <div className="GNBRightButtonWrapper">
              <a
                href={`${ BASE_URL_STORE }/account/logout?return_url=${ BASE_URL_RIDISELECT }`}
                className="GNB_LinkButton"
              >
                <h2 className="reset-heading">로그아웃</h2>
              </a>
            </div>
          )}
          {!isLoggedIn && (
            <div className="GNBRightButtonWrapper">
              <a
                href={`${ BASE_URL_STORE }/account/oauth-authorize?fallback=signup&return_url=${ window.location.href }`}
                className="GNB_LinkButton"
              >
                <h2 className="reset-heading">회원가입</h2>
              </a>
              <MediaQuery maxWidth={840}>
                {(matches) => (
                  <a
                    href={`${ BASE_URL_STORE }/account/oauth-authorize?fallback=login&return_url=${ window.location.href }`}
                    className="GNB_LinkButton GNB_LinkButton-fill"
                    style={matches ? { color: solidBackgroundColorRGBString } : {}}
                  >
                    로그인
                  </a>
                )}
              </MediaQuery>
            </div>
          )}
        </div>}
      </div>
    </header>
  );
};

const mapStateToProps = (rootState: RidiSelectState) => ({
  gnbType: getGNBType(rootState),
  solidBackgroundColorRGBString: getSolidBackgroundColorRGBString(rootState),
  backgroundColorRGBString: getBackgroundColorRGBString(rootState),
  BASE_URL_STORE: rootState.environment.STORE_URL,
  BASE_URL_RIDISELECT: rootState.environment.SELECT_URL,
  isLoggedIn: rootState.user.isLoggedIn,
  isSubscribing: rootState.user.isSubscribing,
  isInApp: selectIsInApp(rootState),
  isIosInApp: getIsIosInApp(rootState),
  isInAppRoot: getIsInAppRoot(rootState),
  isIosInAppHome: getIsIosInAppHome(rootState),
});

export const ConnectedGNB = connect(mapStateToProps)(GNB);
