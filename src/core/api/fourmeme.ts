import type { TokenData, ApiResponse } from '../../types';
import { API_BASE_URL } from '../../config/config';

export interface FetchTokensParams {
  orderBy: string;
  tokenName?: string;
  pageIndex?: number;
  pageSize?: number;
}

export class FourMemeAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async fetchTokens(params: FetchTokensParams): Promise<TokenData[]> {
    try {
      const url = new URL(this.baseUrl);
      
      // Add query parameters
      url.searchParams.set('orderBy', params.orderBy);
      url.searchParams.set('tokenName', params.tokenName || '');
      url.searchParams.set('listedPancake', 'false');
      url.searchParams.set('pageIndex', (params.pageIndex || 1).toString());
      url.searchParams.set('pageSize', (params.pageSize || 30).toString());
      url.searchParams.set('symbol', '');
      url.searchParams.set('labels', '');

      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json() as ApiResponse;
      
      if (data.code !== 0) {
        throw new Error(`API error: ${data.msg}`);
      }

      return data.data;
    } catch (error) {
      console.error('Failed to fetch tokens:', error);
      throw error;
    }
  }

  async fetchTokensByFilter(
    sortMode: string, 
    filterMode: string, 
    pageSize: number = 30
  ): Promise<TokenData[]> {
    let tokenName = '';
    
    switch (filterMode) {
      case 'chinese':
        tokenName = 'chinese';
        break;
      case 'bsc':
        tokenName = 'bsc';
        break;
      case 'all':
      default:
        tokenName = '';
        break;
    }

    return this.fetchTokens({
      orderBy: sortMode,
      tokenName,
      pageIndex: 1,
      pageSize
    });
  }
}
