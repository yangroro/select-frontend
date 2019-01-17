import * as qs from 'qs';

const LOCAL_STORAGE_KEY = 'rs.categories';

export interface CategoriesLocalStorageData {
  lastVisitedCategoryId: number;
}

export const localStorageManager = (() => ({
  load: (): CategoriesLocalStorageData => {
    const localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
    const parsedLocalStorageData = !localStorageData.length
      ? { lastVisitedCategoryId: undefined }
      : JSON.parse(localStorageData);
    return parsedLocalStorageData;
  },
  save: (state: CategoriesLocalStorageData): void => {
    const newData: CategoriesLocalStorageData = localStorageManager.load();
    newData.lastVisitedCategoryId = state.lastVisitedCategoryId;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      this.clear();
    }
  },
  clear: (): void => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  },
}))();

export function getIdFromLocationSearch(search: string): string {
  return qs.parse(search, { ignoreQueryPrefix: true }).id;
}

export function isValidNumber(id: number) {
  return !Number.isNaN(id) && id !== null;
}
