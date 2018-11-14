const SUBSUCRIPTION_ENTRY_POINT_KEY = 'rs.subscriptionEntryPoint';

export const subscriptionEntryPointHelper = {
  setPathname: (pathname: string) => {
    window.sessionStorage.setItem(SUBSUCRIPTION_ENTRY_POINT_KEY, pathname);
  },
  getPathname: () =>  window.sessionStorage.getItem(SUBSUCRIPTION_ENTRY_POINT_KEY),
  clear: () => {
    window.sessionStorage.removeItem(SUBSUCRIPTION_ENTRY_POINT_KEY);
  },
}
