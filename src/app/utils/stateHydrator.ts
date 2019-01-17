import { RidiSelectState } from 'app/store';
import { DeepPartial } from 'redux';

const KEY_LOCALSTORAGE = 'rs.entireState';
export const stateHydrator = {
  load: (): DeepPartial<RidiSelectState> => {
    const data = localStorage.getItem(KEY_LOCALSTORAGE);
    localStorage.setItem(KEY_LOCALSTORAGE, '');
    if (!data) {
      return {};
    }
    return JSON.parse(data);
  },
  save: (state: RidiSelectState) => {
    try {
      localStorage.setItem(KEY_LOCALSTORAGE, JSON.stringify(state));
    } catch (e) {
      localStorage.removeItem(KEY_LOCALSTORAGE);
    }
  },
};
