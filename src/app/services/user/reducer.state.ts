import { FetchStatusFlag } from 'app/constants';
import { MySelectBook } from 'app/services/mySelect';
import { Ticket } from 'app/services/user/requests';
import { DateDTO, Paginated } from 'app/types';

// TODO: 서버에서 내려주는 방식이 string 으로 내려주고 있어서 확인 후 수정 필요.
// 일단 string으로 받도록 interface에 지정.
export enum PaymentMethodType {
  EVENT = 0,
  CARD = 1,
}

export enum PaymentStatus { // 결제 취소 기능 필요 여부를 논의 중
  CANCELED = 'canceled',
  CONFIRMED = 'confirmed',
  CANCELABLE = 'cancelable',
}

export enum SubscriptionStatus {
  unsubscribed = 0,
  normal = 1,
  /**
   * 사실상 아래 네 가지 상태가 존재하는데 어떻게 처리할지 백엔드와 논의 필요
   * 1. 한 번도 구독한 적이 없는 상태
   * 2. 구독 중인 상태
   * 3. 구독은 해지했으나 이용 가능한 상태(기존 구독 만료일 전까지)
   * 4. 구독이 완전히 해지된 상태 (취소가 가능하다면 취소 상태 포함)
   */
}

export interface MySelectHistroyState extends Paginated<MySelectBook> {
  deletionFetchingStatus: FetchStatusFlag;
}

export interface SubscriptionState {
  subscriptionId: number;
  subscriptionDate: DateDTO;
  ticketStartDate: DateDTO;
  ticketEndDate: DateDTO;
  nextBillDate: DateDTO;
  isOptout: boolean;
  isOptoutCancellable: boolean;
  optoutDate: DateDTO; // Will it be empty?
  optoutReason: string | null;
  optoutReasonKor: string | null;
  paymentMethod: string;
  isUsingRidipay: boolean;
}

export interface PurchaseHistory extends Paginated<Ticket> {
  isCancelFetching: boolean;
}

export interface UserState {
  isLoggedIn: boolean;
  uId: string;
  email: string;
  isSubscribing: boolean;
  hasSubscribedBefore: boolean;
  subscriptionFetchStatus: FetchStatusFlag;
  unsubscriptionFetchStatus: FetchStatusFlag;
  unsubscriptionCancellationFetchStatus: FetchStatusFlag;
  subscription?: SubscriptionState;
  mySelectHistory: MySelectHistroyState;
  purchaseHistory: PurchaseHistory;
}

export const initialUserState: UserState = {
  isLoggedIn: false,
  uId: '',
  email: '',
  isSubscribing: false,
  hasSubscribedBefore: false,
  subscriptionFetchStatus: FetchStatusFlag.IDLE,
  unsubscriptionFetchStatus: FetchStatusFlag.IDLE,
  unsubscriptionCancellationFetchStatus: FetchStatusFlag.IDLE,
  mySelectHistory: {
    itemListByPage: {},
    deletionFetchingStatus: FetchStatusFlag.IDLE,
  },
  purchaseHistory: {
    itemListByPage: {},
    isCancelFetching: false,
  },
};
