import { RoutePaths } from 'app/constants';
import * as pathToRegexp from 'path-to-regexp';

export const collectionToPath = pathToRegexp.compile(RoutePaths.COLLECTION);
export const closingReservedBooksToPath = pathToRegexp.compile(RoutePaths.CLOSING_RESERVED_BOOKS);
