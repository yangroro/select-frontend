import { RidiSelectState } from "app/store";

const KEY_LOCALSTORAGE = 'rs.entireState';
export const stateHydrator = {
  load: (): RidiSelectState | null => {
    const data = localStorage.getItem(KEY_LOCALSTORAGE);
    localStorage.setItem(KEY_LOCALSTORAGE, '');
    if (!data) {
      return null;
    }
    return JSON.parse(data);
  },
  save: (state: RidiSelectState) => {
    try {
      localStorage.setItem(KEY_LOCALSTORAGE, JSON.stringify(state));
    } catch(e) {
      localStorage.removeItem(KEY_LOCALSTORAGE);
    }
  },
};
