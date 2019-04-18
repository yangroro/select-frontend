export const getTitleByPath = (path: string): string => {
  switch (path) {
    case '/': {
      return '리디셀렉트 - 신간도 베스트셀러도 월정액으로 제한없이';
    }
    case '/books': {
      return '서비스 도서 목록 - 리디셀렉트';
    }
    case '/guide': {
      return '이용 방법 - 리디셀렉트';
    }
  }

  return null;
};
