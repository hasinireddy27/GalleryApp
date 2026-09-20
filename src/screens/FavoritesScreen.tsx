import React, {
  useMemo,
  useState,
} from 'react';

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { useGallery } from '../context/GalleryContext';
import { GalleryImage } from '../types/gallery';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#0F172A' : '#F5F5F5',
    card: isDark ? '#1E293B' : '#FFFFFF',
    input: isDark ? '#334155' : '#F1F1F1',
    primary: isDark ? '#60A5FA' : '#007AFF',
    text: isDark ? '#F8FAFC' : '#111827',
    secondaryText: isDark ? '#CBD5E1' : '#777777',
    placeholder: isDark ? '#94A3B8' : '#999999',
  };

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();

  const {
    favorites,
    toggleFavorite,
  } = useGallery();

  const [searchText, setSearchText] =
    useState('');

  const filteredFavorites = useMemo(() => {
    const search =
      searchText.toLowerCase().trim();

    return favorites.filter((image) =>
      image.author
        .toLowerCase()
        .includes(search)
    );
  }, [favorites, searchText]);

  const renderImage = ({
    item,
  }: {
    item: GalleryImage;
  }) => {
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
          style={[
            styles.favoriteButton,
            {
              backgroundColor: colors.card,
            },
          ]}
          onPress={() =>
            toggleFavorite(item)
          }
        >
          <Text style={styles.favoriteText}>
            ♥
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.info,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <Text
            style={[
              styles.author,
              {
                color: colors.text,
              },
            ]}
            numberOfLines={1}
          >
            {item.author}
          </Text>

          <Text
            style={[
              styles.id,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            ID: {item.id}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          Favorites
        </Text>

        <Text
          style={[
            styles.count,
            {
              color: colors.secondaryText,
            },
          ]}
        >
          {favorites.length} saved
        </Text>
      </View>

      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.card,
          },
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
          placeholder="Search favorites by author..."
          placeholderTextColor={
            colors.placeholder
          }
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />
      </View>

      {filteredFavorites.length === 0 ? (
        <View
          style={[
            styles.emptyContainer,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <Text style={styles.emptyIcon}>
            ♥
          </Text>

          <Text
            style={[
              styles.emptyTitle,
              {
                color: colors.text,
              },
            ]}
          >
            No favorites found
          </Text>

          <Text
            style={[
              styles.emptyText,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            Add images to favorites from
            the gallery.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          renderItem={renderImage}
          keyExtractor={(item) => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gallery}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  count: {
    fontSize: 14,
    marginTop: 3,
  },

  searchContainer: {
    paddingHorizontal: 15,
    paddingBottom: 12,
  },

  searchInput: {
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 11,
    fontSize: 15,
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  favoriteText: {
    fontSize: 20,
    color: 'red',
  },

  info: {
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
    marginTop: 2,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  emptyIcon: {
    fontSize: 50,
    color: 'red',
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  emptyText: {
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
});
