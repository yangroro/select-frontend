import Router from 'express-promise-router';

import fetch from 'node-fetch';
import { XmlEntities } from 'html-entities';

import { override, OpenGraph } from './utils/override';

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
    const openGraph: Partial<OpenGraph> = {
      title: `${data.title.main} - 리디셀렉트`,
      description: description.length > MAX_DESCRIPTION_LENGTH ? `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...` : description,
      type: 'books.book',
      url: `https://select.ridibooks.com/book/${bookId}`,
      image: getThumbnailUrl(data.thumbnail),
      imageHeight: false,
      imageWidth: false,
    };
    res.set('Content-Type', 'text/html');
    res.send(await override(openGraph));
  } catch (e) {
    res.set('Content-Type', 'text/html');
    res.send(await override());
  }
});

export default router;
