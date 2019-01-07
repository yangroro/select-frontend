import { camelize } from '@ridi/object-case-converter';
import env from 'app/config/env';
import { SearchResultBook } from 'app/services/searchResult/reducer.state';
import request from 'app/utils/request';
import { AxiosResponse } from 'axios';

export interface SearchResultReponse {
  totalCount: number;
  size: number;
  books: SearchResultBook[];
}

export const requestSearchResult = (
  keyword: string,
  page: number
): Promise<AxiosResponse<SearchResultReponse>> =>
  request({
    url: `${env.SELECT_API}/api/search`,
    method: 'get',
    params: {
      keyword,
      page
    }
  }).then(response =>
    camelize<AxiosResponse<SearchResultReponse>>(response.data, { recursive: true })
  );
