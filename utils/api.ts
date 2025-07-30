import axios from 'axios';
import type { ApiResponse } from '../types/apiResponse';

export const fetchArtworks = async (page: number): Promise<ApiResponse> => {
    
  try {
    const {data} = await axios.get<ApiResponse>( `https://api.artic.edu/api/v1/artworks?page=${page}`);
    return {
      data: data.data,
      pagination: data.pagination
    };
  } catch (error) {
    console.error('Error loading artworks page:', error);
    throw error;
  }
};