import { RoutePaths } from 'app/constants';
import * as pathToRegexp from 'path-to-regexp';

export const collectionToPath = pathToRegexp.compile(RoutePaths.COLLECTION);
