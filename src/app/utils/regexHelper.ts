import Env from 'app/config/env';

export function isRidiselectUrl(url: string) {
  const ridiselectReg = new RegExp(`^https?:${Env.SELECT_URL}/`);
  const schemeReg = /^https?:\/\//;

  return ridiselectReg.test(url) || !schemeReg.test(url);
}
