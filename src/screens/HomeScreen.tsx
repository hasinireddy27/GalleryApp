import React, { useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import { useGallery } from '../context/GalleryContext';
import { GalleryImage } from '../types/gallery';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
type FilterType = 'All' | 'A-M' | 'N-Z';

type NavigationProp =
  NativeStackNavigationProp<
    RootStackParamList
  >;

export default function HomeScreen() {

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#0F172A' : '#EEF4FF',
    card: isDark ? '#1E293B' : '#FFFFFF',
    primary: isDark ? '#60A5FA' : '#2563EB',
    text: isDark ? '#F8FAFC' : '#111827',
    secondaryText: isDark ? '#CBD5E1' : '#6B7280',
    border: isDark ? '#475569' : '#E5E7EB',
    input: isDark ? '#334155' : '#F9FAFB',
    placeholder: isDark ? '#94A3B8' : '#9CA3AF',
  };
  const navigation =
    useNavigation<NavigationProp>();
  const {
    images,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    toggleFavorite,
    isFavorite,
    refreshImages,
    loadMoreImages,
  } = useGallery();
  

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] =
    useState<FilterType>('All');

  const filteredImages = useMemo(() => {
    return images.filter((image) => {
      const author =
        image.author.toLowerCase();

      const search =
        searchText.toLowerCase().trim();

      const matchesSearch =
        author.includes(search);

      const firstLetter =
        image.author
          .charAt(0)
          .toUpperCase();

      let matchesFilter = true;

      if (filter === 'A-M') {
        matchesFilter =
          firstLetter >= 'A' &&
          firstLetter <= 'M';
      }

      if (filter === 'N-Z') {
        matchesFilter =
          firstLetter >= 'N' &&
          firstLetter <= 'Z';
      }

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [images, searchText, filter]);

  const handleFavorite = async (
    image: GalleryImage
  ) => {
    try {
      await toggleFavorite(image);
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to update favorite.'
      );
    }
  };

  const renderImage = ({
    item,
  }: {
    item: GalleryImage;
  }) => {
    const favorite =
      isFavorite(item.id);

    return (
      <View style={styles.card}>
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
                navigation.navigate('ImageDetails', {
                image: item,
                })
            }
            >
            <Image
                source={{
                uri: item.download_url,
                }}
                style={styles.image}
            />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() =>
            handleFavorite(item)
          }
        >
          <Text
            style={[
              styles.favoriteText,
              favorite &&
                styles.favoriteActive,
            ]}
          >
            {favorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>

        <View
  style={[
    styles.info,
    { backgroundColor: colors.card },
  ]}
>
          <Text
  style={[
    styles.author,
    { color: colors.text },
  ]}
  numberOfLines={1}
>
            {item.author}
          </Text>

          <Text
  style={[
    styles.id,
    { color: colors.secondaryText },
  ]}
>
  ID: {item.id}
</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View
  style={[
    styles.loadingContainer,
    { backgroundColor: colors.background },
  ]}
>
        <ActivityIndicator
          size="large"
        />

        <Text
  style={[
    styles.loadingText,
    { color: colors.secondaryText },
  ]}
>
  Loading gallery...
</Text>
      </View>
    );
  }

  if (error) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>
        Unable to load gallery
      </Text>

      <Text style={styles.errorText}>
        {error}
      </Text>

      <TouchableOpacity
        style={styles.retryButton}
        onPress={refreshImages}
      >
        <Text style={styles.retryText}>
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );
}

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View
  style={[
    styles.header,
    { backgroundColor: colors.card },
  ]}
>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>
  My Gallery
</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
  {filteredImages.length} images
</Text>
        </View>
      </View>

      <View
  style={[
    styles.searchContainer,
    { backgroundColor: colors.card },
  ]}
>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.input,
              color: colors.text,
            },
          ]}
          placeholder="Search by author..."
          placeholderTextColor={colors.placeholder}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />
      </View>

      <View
  style={[
    styles.filterContainer,
    { backgroundColor: colors.card },
  ]}
>
        {(
          ['All', 'A-M', 'N-Z'] as FilterType[]
        ).map((option) => (
          <TouchableOpacity
            key={option}
            style={[
  styles.filterButton,
  {
    backgroundColor:
      filter === option
        ? colors.primary
        : colors.input,
  },
]}
            onPress={() =>
              setFilter(option)
            }
          >
            <Text
  style={[
    styles.filterText,
    {
      color:
        filter === option
          ? '#FFFFFF'
          : colors.text,
    },
  ]}
>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredImages.length === 0 ? (
        <View
  style={[
    styles.emptyContainer,
    { backgroundColor: colors.background },
  ]}
>
          <Text style={styles.emptyIcon}>
            🔍
          </Text>
<Text
  style={[
    styles.emptyTitle,
    { color: colors.text },
  ]}
>
  No images found
</Text>

          <Text
  style={[
    styles.emptyText,
    { color: colors.secondaryText },
  ]}
>
  Try another search or filter.
</Text>
        </View>
      ) : (
        <FlatList
          data={filteredImages}
          renderItem={renderImage}
          keyExtractor={(item) => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.gallery
          }
          onEndReached={loadMoreImages}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refreshImages}
            />
          }
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" />
                <Text style={styles.footerText}>
                  Loading more images...
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
  },

  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  footerText: {
    marginTop: 8,
    fontSize: 13,
    color: '#777',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 3,
  },

  searchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },

  searchInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 11,
    fontSize: 15,
  },

  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingBottom: 12,
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eeeeee',
  },

  activeFilterButton: {
    backgroundColor: '#007AFF',
  },

  filterText: {
    fontSize: 14,
    color: '#555',
  },

  activeFilterText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  gallery: {
    padding: 4,
  },

  card: {
    width: '33.33%',
    padding: 2,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: 120,
    borderRadius: 6,
  },

  favoriteButton: {
    position: 'absolute',
    right: 7,
    top: 7,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  favoriteText: {
    fontSize: 20,
  },

  favoriteActive: {
    color: 'red',
  },

  info: {
    backgroundColor: '#ffffff',
    padding: 5,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },

  author: {
    fontSize: 11,
    fontWeight: '600',
  },

  id: {
    fontSize: 10,
    color: '#777',
    marginTop: 2,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#777',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  errorContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 30,
  backgroundColor: '#f5f5f5',
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  errorText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  emptyText: {
    fontSize: 14,
    color: '#777',
    marginTop: 6,
  },
});