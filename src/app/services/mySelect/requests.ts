import { camelize } from '@ridi/object-case-converter';
import { Book } from 'app/services/book';
import { BookId, DateDTO } from 'app/types';
import request from 'app/utils/request';
import { AxiosResponse } from 'axios';
import { env } from 'app/config/env';

export interface BookIdsPair {
  bookId: number;
  mySelectBookId: number;
}

export interface UserRidiSelectBookResponse {
  id: number;
  bId: string;
  startDate: DateDTO;
  endDate: DateDTO;
  book: Book;
}

export interface MySelectListResponse {
  userRidiSelectBooks: UserRidiSelectBookResponse[];
  totalCount: number;
  size: number;
}

export interface MySelectDeleteResponse {
  code: number;
  message: string;
}

export const requestMySelectList = (page: number): Promise<MySelectListResponse> =>
  request({
    url: `${env.BASE_URL_STORE_API}/api/select/users/me/books`,
    method: 'GET',
    params: {
      newest_first: true,
      page,
    },
  }).then((response) => camelize<AxiosResponse<MySelectListResponse>>(response, { recursive: true }).data);

export const requestDeleteMySelect = (mySelectBookIds: number[]): Promise<AxiosResponse<MySelectDeleteResponse>> =>
  request({
    url: `${env.BASE_URL_STORE_API}/api/select/users/me/books`,
    method: 'DELETE',
    data: {
      user_select_book_ids: mySelectBookIds,
    },
  }).then((response) => camelize<AxiosResponse<MySelectDeleteResponse>>(response, { recursive: true }));

export const requestAddMySelect = (bookId: BookId): Promise<UserRidiSelectBookResponse> =>
  request({
    url: `${env.BASE_URL_STORE_API}/api/select/users/me/books`,
    method: 'POST',
    data: {
      b_id: String(bookId),
    },
  }).then((response) => camelize<AxiosResponse<UserRidiSelectBookResponse>>(response, { recursive: true }).data);
