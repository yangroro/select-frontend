import * as WebFont from 'webfontloader';

export const loadFonts = () => {
  WebFont.load({
    custom: {
      families: ['Noto Sans KR:n4,n7,n9', 'Minion Pro', 'review_num'],
      urls: ['/assets/font.css'],
    },
    timeout: 60000,
  });
};
