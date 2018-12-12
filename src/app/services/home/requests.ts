import { camelize } from '@ridi/object-case-converter';
import { AuthorKeys, Book } from 'app/services/book/reducer.state';
import { SelectionResponse } from 'app/services/selection/requests';
import request from 'app/utils/request';
import { AxiosResponse } from 'axios';
import { BigBanner } from 'app/services/home/reducer.state';
import * as qs from 'qs';
import { responseCommentsToCommentIdListByPage } from '../review/reducer.helpers';

export interface HomeResponse {
  bigBanners: BigBanner[];
  collections: SelectionResponse[];
}

function* thumbnailMaker() {
  while (true) {
    yield 'https://misc.ridibooks.com/cover/1508005038/xxlarge';
    yield 'https://misc.ridibooks.com/cover/2025000014/xxlarge';
    yield 'https://misc.ridibooks.com/cover/734001589/xxlarge';
    yield 'https://misc.ridibooks.com/cover/510000730/xxlarge';
    yield 'https://misc.ridibooks.com/cover/862000638/xxlarge';
    yield 'https://misc.ridibooks.com/cover/1546000409/xxlarge';
  }
}

const thumbnailGen = thumbnailMaker();

export const getDummyBook = (id: number): Book => ({
  id,
  title: {
    main: '돌이킬 수 없는 약속',
  },
  thumbnail: {
    small: 'https://misc.ridibooks.com/cover/1508005038/small',
    large: thumbnailGen.next().value,
    xxlarge: 'https://misc.ridibooks.com/cover/1508005038/xxlarge',
  },
  reviewSummary: {
    buyerRatingAverage: 1,
    buyerRatingDistribution: [1, 1, 1],
    totalRatingCount: 1,
    buyerRatingCount: 1,
    buyerReviewCount: 1,
    totalReviewCount: 1,
  },
  authors: {
    [AuthorKeys.author]: [{ name: '조앤K.롤링' }, { name: '이현수' }, { name: '조규진' }],
    [AuthorKeys.translator]: [
      { name: '김혜원' },
      { name: '이현수' },
      { name: '조규진' },
      { name: '이준우' },
    ],
  },
});

export const requestHome = (): Promise<HomeResponse> => {
  const queryString = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  return request({
    url: '/api/pages/home',
    params: queryString.test_group && queryString.test_group.length > 0 ? { test_group: queryString.test_group } : {},
    method: 'GET',
  }).then((response) => camelize<AxiosResponse<HomeResponse>>(response, { recursive: true }).data);
}
