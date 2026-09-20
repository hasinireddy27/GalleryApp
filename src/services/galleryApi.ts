import { GalleryImage } from '../types/gallery';

const API_URL = 'https://picsum.photos/v2/list';

export async function fetchGalleryImages(
  page: number = 1,
  limit: number = 20
): Promise<GalleryImage[]> {
  const response = await fetch(
    `${API_URL}?page=${page}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error(
      'Failed to fetch gallery images'
    );
  }

  const data: GalleryImage[] =
    await response.json();

  return data;
}