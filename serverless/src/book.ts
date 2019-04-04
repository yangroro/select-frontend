import Router from 'express-promise-router';

import fetch from 'node-fetch';
import { XmlEntities } from 'html-entities';

import { OpenGraph } from './types';
import { getTagsByUrl } from './utils/getTagsByUrl';

const { decode } = new XmlEntities();

const MAX_DESCRIPTION_LENGTH = 165;

const getThumbnailUrl = (thumbnails: {
  small?: string,
  large?: string,
  xxlarge?: string,
}) => {
  return thumbnails.xxlarge || thumbnails.large || thumbnails.small || '';
};

const getBookApiUrl = (bookId: string, paths: string = '') => {
  return `https://book-api.ridibooks.com/books/${bookId}${paths}`;
}

const router = Router();

router.get('/:id', async (req, res) => {
  const { id: bookId } = req.params;
  try {
    const data = await (await fetch(getBookApiUrl(bookId))).json();
    const { descriptions } = await (await fetch(getBookApiUrl(bookId, '/descriptions'))).json();
    const description = decode(descriptions.intro);
    const openGraph: OpenGraph = {
      title: `${data.title.main} - 리디셀렉트`,
      description: description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...` : description,
      type: 'book',
      url: `https://select.ridibooks.com/book/${bookId}`,
      image: getThumbnailUrl(data.thumbnail),
    };
    res.render('openGraph', openGraph);
  } catch (e) {
    res.render('openGraph', await getTagsByUrl(req));
  }
});

export default router;
