import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Router from './src/routers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

global.__basedir = __dirname;

const app = express();
app.use(logger('dev'));
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
    xPoweredBy: false,
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public/uploads'));
const port = process.env.PORT;
app.use('/api', Router);
app.use('/file', express.static('public/uploads'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log('Server listening http://localhost:' + port);
});
