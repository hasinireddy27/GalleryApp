import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  fetchGalleryImages,
} from '../services/galleryApi';

import { GalleryImage } from '../types/gallery';

interface GalleryContextType {
  images: GalleryImage[];
  favorites: GalleryImage[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasMore: boolean;
  toggleFavorite: (
    image: GalleryImage
  ) => Promise<void>;
  isFavorite: (imageId: string) => boolean;
  refreshImages: () => Promise<void>;
  loadMoreImages: () => Promise<void>;
}

const GalleryContext =
  createContext<GalleryContextType | undefined>(
    undefined
  );

const FAVORITES_KEY = '@gallery_favorites';

const PAGE_LIMIT = 20;

export function GalleryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [images, setImages] =
    useState<GalleryImage[]>([]);

  const [favorites, setFavorites] =
    useState<GalleryImage[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isLoadingMore, setIsLoadingMore] =
    useState(false);

  const [isRefreshing, setIsRefreshing] =
    useState(false);

  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [hasMore, setHasMore] =
    useState(true);

  useEffect(() => {
    loadGallery();
    loadFavorites();
  }, []);

  const loadGallery = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data =
        await fetchGalleryImages(
          1,
          PAGE_LIMIT
        );

      setImages(data);
      setCurrentPage(1);

      setHasMore(data.length === PAGE_LIMIT);
    }  catch (error) {
        console.log('Error loading gallery:', error);
        setError('Unable to load images. Please check your internet connection.');
      } finally {
        setIsLoading(false);
      }
  };

  const loadMoreImages = async () => {
    if (
      isLoadingMore ||
      !hasMore ||
      isLoading
    ) {
      return;
    }

    try {
      setIsLoadingMore(true);

      const nextPage =
        currentPage + 1;

      const newImages =
        await fetchGalleryImages(
          nextPage,
          PAGE_LIMIT
        );

      if (newImages.length === 0) {
        setHasMore(false);
        return;
      }

      setImages((previousImages) => {
        const existingIds = new Set(
          previousImages.map(
            (image) => image.id
          )
        );

        const uniqueImages =
          newImages.filter(
            (image) =>
              !existingIds.has(image.id)
          );

        return [
          ...previousImages,
          ...uniqueImages,
        ];
      });

      setCurrentPage(nextPage);

      if (
        newImages.length < PAGE_LIMIT
      ) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(
        'Error loading more images:',
        error
      );
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites =
        await AsyncStorage.getItem(
          FAVORITES_KEY
        );

      if (savedFavorites) {
        setFavorites(
          JSON.parse(savedFavorites)
        );
      }
    } catch (error) {
      console.log(
        'Error loading favorites:',
        error
      );
    }
  };

  const toggleFavorite = async (
    image: GalleryImage
  ) => {
    const alreadyFavorite =
      favorites.some(
        (favorite) =>
          favorite.id === image.id
      );

    let updatedFavorites:
      GalleryImage[];

    if (alreadyFavorite) {
      updatedFavorites =
        favorites.filter(
          (favorite) =>
            favorite.id !== image.id
        );
    } else {
      updatedFavorites = [
        ...favorites,
        image,
      ];
    }

    setFavorites(updatedFavorites);

    await AsyncStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(
        updatedFavorites
      )
    );
  };

  const isFavorite = (
    imageId: string
  ) => {
    return favorites.some(
      (favorite) =>
        favorite.id === imageId
    );
  };

  const refreshImages = async () => {
    try {
      setIsRefreshing(true);

      const data =
        await fetchGalleryImages(
          1,
          PAGE_LIMIT
        );

      setImages(data);
      setCurrentPage(1);
      setHasMore(
        data.length === PAGE_LIMIT
      );
    } catch (error) {
      console.log(
        'Error refreshing gallery:',
        error
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <GalleryContext.Provider
      value={{
        images,
        favorites,
        isLoading,
        isLoadingMore,
        isRefreshing,
        hasMore,
        error,
        toggleFavorite,
        isFavorite,
        refreshImages,
        loadMoreImages,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context =
    useContext(GalleryContext);

  if (!context) {
    throw new Error(
      'useGallery must be used inside GalleryProvider'
    );
  }

  return context;
}