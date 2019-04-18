import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import serverless from 'serverless-http';
import app from './src/app';

export const server: APIGatewayProxyHandler = serverless(app);
