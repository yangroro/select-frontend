import { camelize } from '@ridi/object-case-converter';
import { Book } from 'app/services/book/reducer.state';
import { SelectionType } from 'app/services/home';
import { SelectionId } from 'app/services/selection/actions';
import request from 'app/utils/request';
import { AxiosResponse } from 'axios';
import * as qs from 'qs';

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
