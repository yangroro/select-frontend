import { AxiosResponse } from 'axios';

import { camelize } from '@ridi/object-case-converter';
import { Book } from 'app/services/book';
import request from 'app/utils/request';
import { Category } from 'app/services/category';
import env from 'app/config/env';

export interface CategoryBooksResponse  {
  totalCount: number;
  category: Category;
  books: Book[];
}

export const requestCategoryBooks = (
  categoryId: number,
  page: number,
): Promise<CategoryBooksResponse> => {
  return request({
    url: `${env.SELECT_API}/api/categories/${categoryId}/books`,
    method: 'GET',
    params: { page },
  }).then((response) => camelize<AxiosResponse<CategoryBooksResponse>>(response, { recursive: true }).data);
};

export const requestCategoryList = (): Promise<Category[]> => (request({
  url: `${env.SELECT_API}/api/categories`,
  method: 'GET',
}).then((response) => response.data));
