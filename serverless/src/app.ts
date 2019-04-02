import * as express from 'express';
import book from './book';

import { getTagsByUrl } from './utils/getTagsByUrl';

const app = express();
app.set('view engine', 'pug');

app.use('/book', book);
app.use(async (req, res) => res.render('openGraph', await getTagsByUrl(req)));

export default app;
