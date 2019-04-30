
import { AxiosResponse } from 'axios';

import { camelize } from '@ridi/object-case-converter';
import request from 'app/config/axios';

import {
  Book,
} from 'app/services/book';

export type closingReservedTermType = 'thisMonth' | 'nextMonth';

export interface ClosingReservedBooksResponse {
  totalCount: number;
  size: number;
  books: Book[];
}

export const requestClosingReservedBooks = (termType: closingReservedTermType, page: number): Promise<ClosingReservedBooksResponse> =>
  request({
    url: `/api/books?expire_in=${termType === 'thisMonth' ? 'this_month' : 'next_month'}`,
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<ClosingReservedBooksResponse>>(response, { recursive: true }).data);
