import { ThumbnailSize } from 'app/components/BookThumbnail/types';

export function getThumbnailHeight(width: ThumbnailSize) {
  return Math.floor(width * 1.618 - 10);
}
