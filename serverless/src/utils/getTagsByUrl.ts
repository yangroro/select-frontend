import * as express from 'express';
import fetch from 'node-fetch';
import { parse, HTMLElement } from 'node-html-parser';

import { OpenGraph } from '../types';

export const getTagsByUrl = async (req: express.Request): Promise<OpenGraph> => {
  const origin = 'http://select.ridibooks.com.s3-website.ap-northeast-2.amazonaws.com';
  const root = parse(await (await fetch(origin)).text()) as HTMLElement;
  const og: { [key: string]: string } = root.querySelectorAll('meta')
    .filter(meta => /og:/.test(meta.attributes.property))
    .reduce<any>((acc, { attributes }) => {
      const { property, content = '' } = attributes;
      if (property) acc[property.slice(3)] = content;
      return acc;
    }, {});

  const defaultTags: OpenGraph = {
    title: og.title,
    description: og.description,
    type: og.type,
    url: `https://select.ridibooks.com${req.url}`,
    image: og.image,
    imageWidth: og['image:width'],
    imageHeight: og['image:height'],
  };

  switch (req.path) {
    case '/': {
      return {
        ...defaultTags,
        title: '리디셀렉트 - 베스트셀러를 무제한으로 읽어보세요, 첫 1개월 무료',
      };
    }
    case '/books': {
      return {
        ...defaultTags,
        title: '서비스 도서 목록 - 리디셀렉트',
      };
    }
    case '/guide': {
      return {
        ...defaultTags,
        title: '이용 방법 - 리디셀렉트',
      };
    }
  }

  return defaultTags;
};
