# 🦉 Foto Owl — GalleryApp

A React Native gallery application built with **Expo, TypeScript, and React Navigation**. The app provides user authentication, image browsing, search and filtering, favorites, image details, profile management, and image downloading.

## 📱 Features

### 🔐 Authentication

* User registration
* Login and logout
* Form validation
* Email validation
* Mobile number validation
* Password validation
* Password confirmation
* Local storage using AsyncStorage
* Session persistence after app restart

### 🖼️ Gallery

* Fetches images from the Picsum Photos API
* 3-column image grid
* Displays image author and ID
* Search images by author
* Case-insensitive search
* Filter images using:

  * All
  * A–M
  * N–Z
* Search and filtering work together
* Pull-to-refresh
* Infinite scroll / pagination
* Loading indicators
* API error handling with retry

### ❤️ Favorites

* Add/remove images from favorites
* Favorites persist after restarting the app
* Search favorites by author
* Remove favorites
* Tap a favorite to open Image Details

### 🔍 Image Details

* Larger image preview
* Author information
* Image ID
* Download image to the device gallery
* Downloaded images are stored in a dedicated `GalleryApp` album

### 👤 Profile

* View user profile
* Edit profile information
* Update:

  * Full Name
  * Gender
  * Mobile
  * Address
  * City
* Profile changes are persisted locally
* Logout functionality

### 🌙 Dark Mode

* Supports system Light/Dark mode
* Dynamic colors for:

  * Background
  * Cards
  * Text
  * Inputs
  * Buttons
  * Bottom navigation

## 🛠️ Tech Stack

* **React Native**
* **Expo SDK 57**
* **TypeScript**
* **React Navigation**
* **AsyncStorage**
* **Expo Media Library**
* **Expo File System**
* **Picsum Photos API**

## 🌐 API

The application uses the Picsum Photos API:

`https://picsum.photos/v2/list?page=1&limit=50`

The gallery supports pagination by requesting additional pages from the API.

## 📂 Project Structure

```text
GalleryApp/
│
├── assets/
│   └── images/
│
├── src/
│   ├── components/
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── GalleryContext.tsx
│   │
│   ├── hooks/
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── MainStack.tsx
│   │   └── MainTabs.tsx
│   │
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── FavoritesScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   └── ImageDetailsScreen.tsx
│   │
│   ├── services/
│   │   └── galleryApi.ts
│   │
│   ├── types/
│   │   └── gallery.ts
│   │
│   └── utils/
│
├── App.tsx
├── package.json
└── README.md
```

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/hasinireddy27/GalleryApp.git
```

Navigate to the project:

```bash
cd GalleryApp
```

Install dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

For Android:

```bash
npx expo run:android
```

## 📦 APK

A release APK is available for download from the GitHub Release:

**Foto Owl GalleryApp v1.0.0**

[Download APK](https://github.com/hasinireddy27/GalleryApp/releases/download/v1.0.0/FotoOwl-GalleryApp.apk)

## 🔗 Project Links

**GitHub Repository:**
https://github.com/hasinireddy27/GalleryApp

**APK Download:**
https://github.com/hasinireddy27/GalleryApp/releases/download/v1.0.0/FotoOwl-GalleryApp.apk

## 👩‍💻 Developer

**Hasini Reddy**

B.Tech — Artificial Intelligence & Machine Learning

## 📄 Assignment

This project was developed as part of a React Native application assignment demonstrating mobile application development, API integration, local data persistence, navigation, and user interface implementation.

```
```
