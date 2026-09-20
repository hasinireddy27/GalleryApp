import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  fullName: string;
  email: string;
  gender: string;
  mobile: string;
  address: string;
  city: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  registerUser: (userData: User) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const USER_KEY = '@gallery_registered_user';
const SESSION_KEY = '@gallery_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(USER_KEY);
      const savedSession = await AsyncStorage.getItem(SESSION_KEY);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (savedSession === 'true') {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log('Error loading authentication data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (userData: User) => {
    await AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const login = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    const savedUser = await AsyncStorage.getItem(USER_KEY);

    if (!savedUser) {
      return false;
    }

    const registeredUser: User = JSON.parse(savedUser);

    if (
      registeredUser.email.toLowerCase() === email.toLowerCase() &&
      registeredUser.password === password
    ) {
      await AsyncStorage.setItem(SESSION_KEY, 'true');

      setUser(registeredUser);
      setIsLoggedIn(true);

      return true;
    }

    return false;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setIsLoggedIn(false);
  };

  const updateUser = async (updatedUser: User) => {
    await AsyncStorage.setItem(
      USER_KEY,
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        registerUser,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}