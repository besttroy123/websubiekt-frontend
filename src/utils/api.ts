import axios from 'axios';

/**
 * Makes a GET API request to the backend with the specified endpoint parameter
 * @param endpoint - The endpoint parameter to append to the base URL
 * @param params - Optional query parameters to send with the request
 * @returns Promise with the response data
 */
export async function dbRefresh<T = any>(
  endpoint: string,
  params?: any
): Promise<T> {
  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001/api';
  
  try {
    const response = await axios.get(`${BACKEND_URL}/${endpoint}`, {
      params
    });
    
    return response.data;
  } catch (error) {
    console.error(`API GET request failed for endpoint: ${endpoint}`, error);
    throw error;
  }
}