import React from 'react';


import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import {
  Album,
  Asset,
  requestPermissionsAsync,
} from 'expo-media-library';
import { Directory, File, Paths } from 'expo-file-system';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ImageDetails'
>;

export default function ImageDetailsScreen({
  route,
  navigation,
}: Props) {
  const { image } = route.params;

  const handleDownload = async () => {
  try {
    const permission =
      await requestPermissionsAsync();

    if (!permission.granted) {
      alert('Permission is required to save the image.');
      return;
    }

    const fileName = `image_${image.id}_${Date.now()}.jpg`;
    const destination = new File(Paths.cache, fileName);

    const file = await File.downloadFileAsync(
      image.download_url,
      destination,
      { idempotent: true }
    );

    const asset = await Asset.create(file.uri);

    const album = await Album.get('GalleryApp');

    if (album) {
      await album.add(asset);
    } else {
      await Album.create(
        'GalleryApp',
        [asset],
        false
      );
    }

    alert('Image downloaded successfully!');
  } catch (error) {
    console.error('Download error:', error);
    alert('Failed to download image.');
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButton}>
            ‹
          </Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Image Details
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <Image
        source={{ uri: image.download_url }}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.infoCard}>
        <Text style={styles.label}>
          Author
        </Text>

        <Text style={styles.value}>
          {image.author}
        </Text>

        <Text style={styles.label}>
          Image ID
        </Text>

        <Text style={styles.value}>
          {image.id}
        </Text>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
        >
          <Text style={styles.downloadText}>
            Download Image
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    height: 100,
    paddingTop: 45,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    fontSize: 40,
    color: '#007AFF',
    lineHeight: 40,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  headerSpace: {
    width: 30,
  },

  image: {
    width: '100%',
    height: 450,
    backgroundColor: '#eeeeee',
  },

  infoCard: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },

  label: {
    fontSize: 13,
    color: '#777',
    marginBottom: 5,
  },

  value: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 18,
  },

  downloadButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },

  downloadText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});