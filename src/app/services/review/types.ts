import { FetchStatusFlag } from 'app/constants';

export interface Page<Item>  {
  fetchStatus: FetchStatusFlag;
  itemList: Item[];
}

export interface Paginated<Item> {
  pageCount: number;
  itemCount: number;
  currentPage: number;
  size: number;
  itemListByPage: {
    [pageNumber: number]: Page<Item>;
  };
}
