import * as classNames from 'classnames';
import * as React from 'react';
import MediaQuery from 'react-responsive';

import { Button, Empty } from '@ridi/rsg';
import { ConnectedPageHeader } from 'app/components';
import { FetchStatusFlag } from 'app/constants';
import {
  ConnectedListWithPagination,
} from 'app/hocs/ListWithPaginationPage';
import { SubscriptionListPlaceholder } from 'app/placeholder/SubscriptionListPlaceholder';
import { Actions, PurchaseHistory } from 'app/services/user';
import { Ticket } from 'app/services/user/requests';
import { RidiSelectState } from 'app/store';
import { buildDateAndTimeFormat } from 'app/utils/formatDate';
import { thousandsSeperator } from 'app/utils/thousandsSeperator';
import toast from 'app/utils/toast';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
type Props = PurchaseHistory & ReturnType<typeof mapDispatchToProps>;

export class OrderHistory extends React.PureComponent<Props> {
  private handleCancelPurchaseButtonClick = (purchaseId: number) => () => {
    if (this.props.isCancelFetching) {
      toast.failureMessage('취소 진행중입니다. 잠시 후에 다시 시도해주세요.');
      return;
    }
    if (confirm(`결제를 취소하시겠습니까?\n결제를 취소할 경우 즉시 이용할 수 없습니다.`)) {
      this.props.dispatchCancelPurchase(purchaseId);
    }
  }
  private getPaymentMethodTypeName = (payment: Ticket) => {
    const suffix = payment.isCanceled ? ' (취소됨)' : '';
    return `${payment.paymentMethod}${suffix}`;
  }

  private renderHistoryInfo = (payment: Ticket) => {
    return (
      <>
        <p className="Ordered_Date">{buildDateAndTimeFormat(payment.purchaseDate)}</p>
        <p className="Ordered_Name">{payment.title}</p>
        <p className="Ordered_Type">{this.getPaymentMethodTypeName(payment)}</p>
      </>
    );
  }

  private renderAmountInfo = (payment: Ticket, shouldDisplayCancel: boolean) => {
    return (
      <>
        <p className="Ordered_Amount">
          {payment.price === 0 ? '무료' : `${thousandsSeperator(payment.price)}원`}
        </p>
        {shouldDisplayCancel && (
          <div className="CancelOrderButton_Wrapper">
            {payment.isCancellable && (
              <Button
                className="CancelOrderButton"
                color="gray"
                outline={true}
                onClick={this.handleCancelPurchaseButtonClick(payment.id)}
                size="medium"
              >
                결제 취소
              </Button>
            )}
          </div>
        )}
      </>
    );
  }

  private renderItems = (page: number) => {
    const { itemList } = this.props.itemListByPage[page];
    if (!itemList || itemList.length === 0) {
      return (
        <Empty description="결제 내역이 존재하지 않습니다." iconName="book_1" />
      );
    }
    const cancelableItemExists = itemList.some((item) => item.isCancellable);
    return (
      <ul className="OrderHistoryList">
        <MediaQuery maxWidth={840}>
          {(isMobile) => {
            return itemList.map((item) => (
              <li
                className={classNames({
                  'OrderHistoryItem': true,
                  'OrderHistoryItem-canceled': item.isCanceled,
                })}
                key={item.id}
              >
                {isMobile ? (
                  <>
                    <div className="OrderHistoryItem_Info">{this.renderHistoryInfo(item)}</div>
                    <div className="OrderHistoryItem_AmountInfo">
                      {this.renderAmountInfo(item, cancelableItemExists)}
                    </div>
                  </>
                ) : (
                  <>
                    {this.renderHistoryInfo(item)}
                    {this.renderAmountInfo(item, cancelableItemExists)}
                  </>
                )}
              </li>
            ));
          }}
        </MediaQuery>
      </ul>
    );
  }

  public componentWillUnmount() {
    this.props.dispatchClearPurchases();
  }

  public render() {
    return (
      <main className="SceneWrapper PageOrderHistory">
        <Helmet title="결제 내역 - 리디셀렉트" />
        <ConnectedPageHeader pageTitle="결제 내역" />
        <ConnectedListWithPagination
          fetch={(page) => this.props.dispatchLoadOrderHistory(page)}
          isFetched={(page) =>
            !!this.props.itemListByPage[page] &&
            this.props.itemListByPage[page].fetchStatus !== FetchStatusFlag.FETCHING
          }
          itemCount={this.props.itemCount}
          buildPaginationURL={(p) => `/order-history?page=${p}`}
          renderPlaceholder={() => (<SubscriptionListPlaceholder />)}
          renderItems={this.renderItems}
        />
        <ul className="NoticeList">
          <li className="NoticeItem">결제 취소는 결제일로부터 7일 이내 이용권 대상 도서를 1권 이상 다운로드하지 않는 경우에만 가능합니다.</li>
          <li className="NoticeItem">결제 취소 시 리디셀렉트 구독이 자동으로 해지됩니다.</li>
        </ul>
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): PurchaseHistory => {
  return state.user.purchaseHistory;
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadOrderHistory: (page: number) => dispatch(Actions.loadPurchasesRequest({ page })),
    dispatchClearPurchases: () => dispatch(Actions.clearPurchases()),
    dispatchCancelPurchase: (purchaseId: number) => dispatch(Actions.cancelPurchaseRequest({ purchaseId })),
  };
};

export const ConnectedOrderHistory = connect(mapStateToProps, mapDispatchToProps)(OrderHistory);
