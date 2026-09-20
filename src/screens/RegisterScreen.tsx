import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useAuth, User } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Picker } from '@react-native-picker/picker';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const { registerUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#0F172A' : '#EEF4FF',
    card: isDark ? '#1E293B' : '#FFFFFF',
    primary: isDark ? '#60A5FA' : '#2563EB',
    text: isDark ? '#F8FAFC' : '#111827',
    secondaryText: isDark ? '#CBD5E1' : '#6B7280',
    label: isDark ? '#E2E8F0' : '#374151',
    input: isDark ? '#334155' : '#F9FAFB',
    border: isDark ? '#475569' : '#E5E7EB',
    placeholder: isDark ? '#94A3B8' : '#9CA3AF',
  };

  const handleRegister = async () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !gender ||
      !mobile ||
      !address.trim() ||
      !city.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert('Error', 'All fields are mandatory.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      Alert.alert(
        'Error',
        'Mobile number must contain exactly 10 digits.'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Error',
        'Password must contain at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Error',
        'Password and Confirm Password must match.'
      );
      return;
    }

    const userData: User = {
      fullName: fullName.trim(),
      email: email.trim(),
      gender,
      mobile,
      address: address.trim(),
      city: city.trim(),
      password,
    };

    try {
      await registerUser(userData);

      Alert.alert(
        'Registration Successful',
        'Your account has been created. Please login.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to create account. Please try again.'
      );
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
  Create Account
</Text>
      <Text style={[styles.label, { color: colors.label }]}>
  Full Name
</Text>
      <TextInput
        style={[
  styles.input,
  {
    backgroundColor: colors.input,
    borderColor: colors.border,
    color: colors.text,
  },
]}
        placeholder="Enter your full name"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={[styles.label, { color: colors.label }]}>Email Address</Text>
      <TextInput
        style={[
  styles.input,
  {
    backgroundColor: colors.input,
    borderColor: colors.border,
    color: colors.text,
  },
]}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={[styles.label, { color: colors.label }]}>Gender</Text>

<View
  style={[
    styles.genderContainer,
    {
      backgroundColor: colors.input,
    },
  ]}
>
  {['Male', 'Female', 'Other'].map((option) => (
    <TouchableOpacity
      key={option}
      style={styles.genderOption}
      onPress={() => setGender(option)}
    >
      <View
        style={[
          styles.radio,
          {
            borderColor: colors.border,
          },
        ]}
      >
        {gender === option ? (
          <View
            style={[
              styles.radioSelected,
              {
                backgroundColor: colors.primary,
              },
            ]}
          />
        ) : null}
      </View>

      <Text style={{ color: colors.text }}>{option}</Text>
    </TouchableOpacity>
  ))}
</View>
      <Text style={[styles.label, { color: colors.label }]}>Mobile Number</Text>

      <TextInput
        style={[
  styles.input,
  {
    backgroundColor: colors.input,
    borderColor: colors.border,
    color: colors.text,
  },
]}
        placeholder="Enter 10-digit mobile number"
        value={mobile}
        onChangeText={(text) =>
          setMobile(text.replace(/[^0-9]/g, ''))
        }
        keyboardType="number-pad"
        maxLength={10}
      />

      <Text style={[styles.label, { color: colors.label }]}>Address</Text>

      <TextInput
         style={[
          styles.input,
          styles.addressInput,
          {
            backgroundColor: isDark ? '#334155' : '#F9FAFB',
            borderColor: isDark ? '#475569' : '#E5E7EB',
            color: isDark ? '#F8FAFC' : '#111827',
          },
        ]}
        placeholder="Enter your address"
        placeholderTextColor={colors.placeholder}
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <Text style={[styles.label, { color: colors.label }]}>City</Text>

<View
  style={[
    styles.pickerContainer,
    {
      backgroundColor: colors.input,
      borderColor: colors.border,
    },
  ]}
>
  <Picker
    selectedValue={city}
    onValueChange={(value) => setCity(value)}
    style={{ color: colors.text }}
    dropdownIconColor={colors.text}
        >
            <Picker.Item label="Select your city" value="" />
            <Picker.Item label="Hyderabad" value="Hyderabad" />
            <Picker.Item label="Warangal" value="Warangal" />
            <Picker.Item label="Karimnagar" value="Karimnagar" />
            <Picker.Item label="Nizamabad" value="Nizamabad" />
            <Picker.Item label="Khammam" value="Khammam" />
            <Picker.Item label="Siddipet" value="Siddipet" />
            <Picker.Item label="Secunderabad" value="Secunderabad" />
            <Picker.Item label="Vijayawada" value="Vijayawada" />
            <Picker.Item label="Visakhapatnam" value="Visakhapatnam" />
            <Picker.Item label="Bengaluru" value="Bengaluru" />
            <Picker.Item label="Chennai" value="Chennai" />
        </Picker>
    </View>
      <Text style={[styles.label, { color: colors.label }]}>Password</Text>

      <TextInput
        style={[
  styles.input,
  {
    backgroundColor: colors.input,
    borderColor: colors.border,
    color: colors.text,
  },
]}
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={[styles.label, { color: colors.label }]}>Confirm Password</Text>

      <TextInput
        style={[styles.input,
  {
    backgroundColor: colors.input,
    borderColor: colors.border,
    color: colors.text,
  },
]}
        placeholder="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
      >
        <Text style={styles.registerButtonText}>
          Register
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginLinkText}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 25,
    marginTop: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },

  addressInput: {
    height: 90,
    textAlignVertical: 'top',
  },

  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
  },

  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },

  registerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },

  registerButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  loginLink: {
    alignItems: 'center',
    marginTop: 18,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 10,
    overflow: 'hidden',
  },

  loginLinkText: {
    color: '#007AFF',
    fontSize: 15,
    fontWeight: '600',
  },
});