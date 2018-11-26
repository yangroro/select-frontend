import * as classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@ridi/rsg/components/dist/icon';
import { GNBColorLevel, GNBTransparentType } from 'app/services/commonUI';
import { ConnectedSearch } from 'app/services/search';
import { RidiSelectState } from 'app/store';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { getSolidBackgroundColorRGBString } from 'app/services/commonUI/selectors';

interface Props {
  gnbType: GNBColorLevel;
  solidBackgroundColorRGBString: string;
  backgroundColorRGBString: string;
  BASE_URL_STORE: string;
  BASE_URL_RIDISELECT: string;
  isLoggedIn: boolean;
  isSubscribing: boolean;
  showRidibooksLogo: boolean;
  showGnbRightSection: boolean;
  logoType: 'default' | 'inAppIntro';
}

export const GNB: React.SFC<Props> = (props) => {
  const {
    gnbType,
    solidBackgroundColorRGBString,
    backgroundColorRGBString,
    isLoggedIn,
    isSubscribing,
    BASE_URL_STORE,
    BASE_URL_RIDISELECT,
    showRidibooksLogo,
    showGnbRightSection,
    logoType,
  } = props;

  const Logo = <>
    <Icon
      name="logo_ridiselect_1"
      className={classNames(
        'GNBLogo',
        { 'GNBLogo-InAppIntro': logoType === 'inAppIntro' }
      )}
    />
    <h1 className="a11y">리디셀렉트</h1>
  </>;

  return (
    <header
      className={classNames(
        'GNBWrapper',
        `GNBWrapper-${gnbType}`,
      )}
      style={{ backgroundColor: backgroundColorRGBString, }}
    >
      <div className="GNBContentWrapper">
        <div className="GNBLeft">
          {logoType === 'default' ?
            <Link className="GNBLogoWrapper" to="/home">{Logo}</Link> :
            <div className="GNBLogoWrapper">{Logo}</div>
          }
          {showRidibooksLogo &&
            <ul className="GNBServiceList">
              <li className="GNBService">
                <a
                  className="GNBServiceLink Ridibooks_Link"
                  href={`${ window.location.protocol }${ BASE_URL_STORE }`}
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
        {showGnbRightSection && <div className="GNBRight">
          {isLoggedIn && isSubscribing && (
            <>
              <MediaQuery maxWidth={840}>
                {(matches) => <ConnectedSearch isMobile={matches} />}
              </MediaQuery>
              <div className="GNBRightButtonWrapper">
                <Link className="GNBSettingButton" to="/settings">
                  <h2 className="a11y">셀렉트 관리</h2>
                  <svg className="SettingIcon" width="48px" height="48px" viewBox="0 0 48 48">
                    <path d="M24,26.667c-7.378,0-13.333-5.956-13.333-13.333S16.622,0,24,0c7.378,0,13.333,5.956,13.333,13.333S31.378,26.667,24,26.667z M48,44.4V48H0v-3.6C0,36.4,16,32,24,32S48,36.4,48,44.4z"/>
                  </svg>
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
  gnbType: rootState.commonUI.gnbTransparentType === GNBTransparentType.transparent ? 'transparent' : rootState.commonUI.gnbColorLevel,
  solidBackgroundColorRGBString: getSolidBackgroundColorRGBString(rootState),
  backgroundColorRGBString: rootState.commonUI.gnbTransparentType === GNBTransparentType.transparent ? 'rgba(0,0,0,0)' : getSolidBackgroundColorRGBString(rootState),
  BASE_URL_STORE: rootState.environment.constants.BASE_URL_STORE,
  BASE_URL_RIDISELECT: rootState.environment.constants.BASE_URL_RIDISELECT,
  isLoggedIn: rootState.user.isLoggedIn,
  isSubscribing: rootState.user.isSubscribing,
  showRidibooksLogo: !rootState.environment.platform.isRidiApp,
  showGnbRightSection: !(rootState.environment.platform.isRidiApp && rootState.router.location!.pathname === '/'),
  logoType: (rootState.environment.platform.isRidiApp && rootState.router.location!.pathname === '/') ? 'inAppIntro' : 'default',
});

export const ConnectedGNB = connect(mapStateToProps)(GNB);
