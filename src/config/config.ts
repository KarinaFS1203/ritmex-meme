import { config } from 'dotenv';
import type { Config } from '../types';

// Load environment variables
config();

export const appConfig: Config = {
  defaultSort: process.env.DEFAULT_SORT || 'Hot',
  defaultFilter: process.env.DEFAULT_FILTER || 'all',
  refreshInterval: parseInt(process.env.REFRESH_INTERVAL || '2000'),
  pageSize: parseInt(process.env.PAGE_SIZE || '30')
};

export const API_BASE_URL = 'https://four.meme/meme-api/v1/private/token/query';
