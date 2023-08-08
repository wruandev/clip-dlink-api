import express, { Application, Request, Response } from 'express';
import cors from 'cors';

import { appConfig, runKnexConfig } from './configs';
import { authRouter, linkRouter, redirectRouter } from './routers';

import { expressErrorHandler } from './utils';

const app: Application = express();
const port = 3010;

//Initialize Knex
runKnexConfig();

app.use(cors());

// Body parsing Middleware
app.use(express.json());

app.get('/', async (req: Request, res: Response): Promise<Response> => {
  req;
  return res.status(200).send({
    message: 'Hello World! from ' + appConfig.baseUrl,
  });
});

app.use('/links', linkRouter);
app.use('/auths', authRouter);
app.get('/notfound', (_req: Request, res: Response) => {
  return res.redirect(appConfig.notFoundURL);
});

app.use('/', redirectRouter);

app.use(expressErrorHandler.errorResponder);

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  if (error instanceof Error) {
    console.error(`Error occured: ${error.message}`);
  }
}
