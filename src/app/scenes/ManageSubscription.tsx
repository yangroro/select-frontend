import * as React from 'react';
import { connect } from 'react-redux';

import { Button, Icon } from '@ridi/rsg';

import { ConnectedPageHeader, HelmetWithTitle, UnsubscribeWarningPopup } from 'app/components';
import history from 'app/config/history';
import { FetchStatusFlag, PageTitleText } from 'app/constants';
import { SubscriptionListPlaceholder } from 'app/placeholder/SubscriptionListPlaceholder';
import { EnvironmentState } from 'app/services/environment';
import { getIsIosInApp } from 'app/services/environment/selectors';
import { Actions, SubscriptionState, UserState } from 'app/services/user';
import { RidiSelectState } from 'app/store';
import { buildDateAndTimeFormat, buildOnlyDateFormat } from 'app/utils/formatDate';
import * as classNames from 'classnames';

interface ManageSubscriptionStateProps {
  userState: UserState;
  environment: EnvironmentState;
  subscriptionState?: SubscriptionState;
  subscriptionFetchStatus: FetchStatusFlag;
  isIosInApp: boolean;
}

interface ManageSubscriptionState {
  isUnsubscribeWarningPopupActive: boolean;
}

type ManageSubscriptionProps = ManageSubscriptionStateProps & ReturnType<typeof mapDispatchToProps>;

export class ManageSubscription extends React.PureComponent<ManageSubscriptionProps, ManageSubscriptionState> {
  public state: ManageSubscriptionState = {
    isUnsubscribeWarningPopupActive: false,
  };

  private moveToNewRelease = () => {
    this.toggleUnsubscribeWarningPopup(false);
    const trackingCode = '?utm_source=etc&utm_medium=etc&utm_campaign=inhouse&utm_term=unknown&utm_content=P001';
    history.push(`/new-releases${trackingCode}`);
  }

  private handleUnsubscribeButtonClick = () => {
    if (this.props.userState.unsubscriptionFetchStatus === FetchStatusFlag.FETCHING) {
      return;
    }
    this.toggleUnsubscribeWarningPopup(false);
    this.props.dispatchUnsubscribeRequest();
  }

  private handleCancelUnsubscriptionButtonClick = () => {
    if (this.props.userState.unsubscriptionCancellationFetchStatus === FetchStatusFlag.FETCHING) {
      return;
    }
    this.props.dispatchCancelUnsubscriptionRequest();
  }

  public toggleUnsubscribeWarningPopup = (activeState: boolean) => {
    this.setState({
      isUnsubscribeWarningPopupActive: activeState,
    });
  }

  public componentDidMount() {
    if (!this.props.subscriptionState) {
      this.props.dispatchLoadSubscriptionRequest();
    }
  }

  public render() {
    const { subscriptionState, environment, isIosInApp } = this.props;
    const { isUnsubscribeWarningPopupActive } = this.state;
    const { PAY_URL: BASE_URL_RIDI_PAY_API } = environment;
    return (
      <main
        className={classNames(
          'SceneWrapper',
          'PageManageSubscription',
        )}
      >
        <HelmetWithTitle titleName={PageTitleText.MANAGE_SUBSCRIPTION} />
        <ConnectedPageHeader pageTitle={PageTitleText.MANAGE_SUBSCRIPTION} />
        {!!subscriptionState
          ? (
            <>
              <ul className="SubscriptionInfo_List">
                <li className="SubscriptionInfo">
                  <p className="SubscriptionInfo_Title">구독 시작 일시</p>
                  <p className="SubscriptionInfo_Data">{buildDateAndTimeFormat(subscriptionState.subscriptionDate)}</p>
                </li>
                <li className="SubscriptionInfo">
                  <p className="SubscriptionInfo_Title">이용 기간</p>
                  <p className="SubscriptionInfo_Data">
                    {buildDateAndTimeFormat(subscriptionState.ticketStartDate)} ~ {buildDateAndTimeFormat(subscriptionState.ticketEndDate)}
                  </p>
                </li>
                {subscriptionState.isOptout
                  ? (
                    <li className="SubscriptionInfo">
                      <p className="SubscriptionInfo_Title">구독 해지 일시</p>
                      <p className="SubscriptionInfo_Data">{buildDateAndTimeFormat(subscriptionState.optoutDate)}</p>
                    </li>
                  )
                  : <>
                    <li className="SubscriptionInfo">
                      <p className="SubscriptionInfo_Title">다음 결제 예정일</p>
                      <p className="SubscriptionInfo_Data">{buildOnlyDateFormat(subscriptionState.nextBillDate)}</p>
                    </li>
                    <li className="SubscriptionInfo">
                      <p className="SubscriptionInfo_Title">결제 예정 금액</p>
                      <p className="SubscriptionInfo_Data">{subscriptionState.formattedMonthlyPayPrice}</p>
                    </li>
                    <li className="SubscriptionInfo">
                      <p className="SubscriptionInfo_Title SubscriptionInfo_CardInfoColumn">결제 수단</p>
                      <div className="SubscriptionInfo_Data SubscriptionInfo_CardInfoColumn">
                        {subscriptionState.paymentMethod}
                        <div className="SubscriptionInfo_CardInfoWrapper">
                          {subscriptionState.cardBrand && subscriptionState.maskedCardNo && (
                            <p className="SubscriptionInfo_CardInfo">
                              {`${subscriptionState.cardBrand} ${subscriptionState.maskedCardNo}`}
                            </p>
                          )}
                          {subscriptionState.isUsingRidipay && !isIosInApp ? (
                            <a className="SubscriptionInfo_Link" href={`${BASE_URL_RIDI_PAY_API}/settings`}>
                              카드 관리
                              <Icon
                                name="arrow_5_right"
                                className="SubscriptionInfo_Link_Icon"
                              />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  </>
                }
              </ul>
              <div className="ToggleSubscriptionButton_Wrapper">
                {subscriptionState.isOptout
                  ? (
                    <Button
                      className="ToggleSubscriptionButton"
                      onClick={this.handleCancelUnsubscriptionButtonClick}
                      spinner={this.props.userState.unsubscriptionCancellationFetchStatus === FetchStatusFlag.FETCHING}
                      color="blue"
                      disabled={!subscriptionState.isOptoutCancellable}
                    >
                      구독 해지 예약 취소
                    </Button>
                  )
                  : (
                    <Button
                      className="ToggleSubscriptionButton"
                      onClick={() => this.toggleUnsubscribeWarningPopup(true)}
                      outline={true}
                      spinner={this.props.userState.unsubscriptionFetchStatus === FetchStatusFlag.FETCHING}
                    >
                      구독 해지 예약
                    </Button>
                  )
                }
              </div>
              {!subscriptionState.isOptout && <p className="UnsubscriptionInfoText">지금 해지 예약하셔도 {buildOnlyDateFormat(subscriptionState.ticketEndDate)}까지 이용할 수 있습니다.</p>}
              {subscriptionState.isOptout
                && !subscriptionState.isOptoutCancellable
                && subscriptionState.optoutReasonKor
                && (
                  <p className="ReasonForNonCancellable">
                    <Icon
                      className="ReasonForNonCancellable_Icon"
                      name="exclamation_3"
                    />
                    <strong>{subscriptionState.optoutReasonKor}</strong><br/>
                    이용 기간 만료 후 다시 구독해주세요.
                  </p>
                )
              }
              <UnsubscribeWarningPopup
                active={isUnsubscribeWarningPopupActive}
                closeFunc={() => this.toggleUnsubscribeWarningPopup(false)}
                moveToNewReleaseFunc={() => this.moveToNewRelease()}
                unsubscribeFunc={() => this.handleUnsubscribeButtonClick()}
              />
            </>
          )
          : (
            <SubscriptionListPlaceholder />
          )
        }
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): ManageSubscriptionStateProps => {
  return {
    userState: state.user,
    environment: state.environment,
    subscriptionState: state.user.subscription,
    subscriptionFetchStatus: state.user.subscriptionFetchStatus,
    isIosInApp: getIsIosInApp(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadSubscriptionRequest: () => dispatch(Actions.loadSubscriptionRequest()),
    dispatchUnsubscribeRequest: () => dispatch(Actions.unsubscribeRequest()),
    dispatchCancelUnsubscriptionRequest: () => dispatch(Actions.cancelUnsubscriptionRequest()),
  };
};

export const ConnectedManageSubscription = connect(mapStateToProps, mapDispatchToProps)(ManageSubscription);
