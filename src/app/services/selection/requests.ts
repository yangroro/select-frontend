import * as qs from 'qs';
import { AxiosResponse } from 'axios';

import { camelize } from '@ridi/object-case-converter';

import request from 'app/config/axios';
import { Book } from 'app/services/book';
import { SelectionType } from 'app/services/home';
import { SelectionId } from 'app/services/selection';
import env from 'app/config/env';

export interface SelectionResponse {
  collectionId: number;
  totalCount: number;
  type: SelectionType;
  title: string;
  books: Book[];
}

export const requestSelection = (
  selectionId: SelectionId,
  page: number,
): Promise<SelectionResponse> => {
  const url = `/api/pages/collections/${selectionId}`;
  const queryString = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  if (selectionId === 'hotRelease') {
    return request({
      url: '/api/pages/collections/hot-release',
      method: 'GET'
    }).then((response) => camelize<AxiosResponse<SelectionResponse>>(response, { recursive: true }).data);
  }
  let params = {
    page,
  };
  if (selectionId === 'popular' && queryString.test_group && queryString.test_group.length > 0) {
    params = Object.assign(params, { test_group: queryString.test_group });
  }
  return request({
    url,
    method: 'GET',
    params,
  }).then((response) => camelize<AxiosResponse<SelectionResponse>>(response, { recursive: true }).data);
};
