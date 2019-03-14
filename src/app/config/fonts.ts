import * as WebFont from 'webfontloader';

import 'css/font.css';

export const loadFonts = () => {
  WebFont.load({
    custom: {
      families: ['Noto Sans KR:n4,n7,n9', 'Minion Pro', 'review_num'],
    },
  });
};
