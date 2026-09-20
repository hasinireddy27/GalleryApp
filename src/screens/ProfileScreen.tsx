import React, { useState } from 'react';

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

export default function ProfileScreen() {
  const {
    user,
    updateUser,
    logout,
  } = useAuth();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? '#0F172A' : '#F5F5F5',
    card: isDark ? '#1E293B' : '#FFFFFF',
    input: isDark ? '#334155' : '#FFFFFF',
    primary: isDark ? '#60A5FA' : '#007AFF',
    text: isDark ? '#F8FAFC' : '#111827',
    secondaryText: isDark ? '#CBD5E1' : '#777777',
    border: isDark ? '#475569' : '#DDDDDD',
    placeholder: isDark ? '#94A3B8' : '#999999',
  };

  const [isEditing, setIsEditing] =
    useState(false);

  const [fullName, setFullName] =
    useState(user?.fullName || '');

  const [email, setEmail] =
    useState(user?.email || '');

  const [gender, setGender] =
    useState(user?.gender || '');

  const [mobile, setMobile] =
    useState(user?.mobile || '');

  const [address, setAddress] =
    useState(user?.address || '');

  const [city, setCity] =
    useState(user?.city || '');

  if (!user) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <Text
          style={{
            color: colors.text,
          }}
        >
          No profile found.
        </Text>
      </View>
    );
  }

  const handleEdit = () => {
    setFullName(user.fullName);
    setEmail(user.email);
    setGender(user.gender);
    setMobile(user.mobile);
    setAddress(user.address);
    setCity(user.city);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !gender ||
      !mobile.trim() ||
      !address.trim() ||
      !city.trim()
    ) {
      Alert.alert(
        'Error',
        'All fields are required.'
      );
      return;
    }

    if (!/^\d{10}$/.test(mobile)) {
      Alert.alert(
        'Error',
        'Mobile number must contain exactly 10 digits.'
      );
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert(
        'Error',
        'Please enter a valid email address.'
      );
      return;
    }

    try {
      await updateUser({
        ...user,
        fullName: fullName.trim(),
        email: email.trim(),
        gender,
        mobile,
        address: address.trim(),
        city: city.trim(),
      });

      setIsEditing(false);

      Alert.alert(
        'Success',
        'Profile updated successfully.'
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to update profile.'
      );
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      contentContainerStyle={styles.content}
    >
      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        My Profile
      </Text>

      <View
        style={[
          styles.avatar,
          {
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Text style={styles.avatarText}>
          {user.fullName
            .charAt(0)
            .toUpperCase()}
        </Text>
      </View>

      {isEditing ? (
        <>
          <Text
            style={[
              styles.label,
              {
                color: colors.text,
              },
            ]}
          >
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
            value={fullName}
            onChangeText={setFullName}
          />

          <Text
            style={[
              styles.label,
              {
                color: colors.text,
              },
            ]}
          >
            Email
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
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text
            style={[
              styles.label,
              {
                color: colors.text,
              },
            ]}
          >
            Gender
          </Text>

          <View
            style={[
              styles.genderContainer,
              {
                backgroundColor: colors.input,
              },
            ]}
          >
            {['Male', 'Female', 'Other'].map(
              (option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.genderOption}
                  onPress={() =>
                    setGender(option)
                  }
                >
                  <View
                    style={[
                      styles.radio,
                      {
                        borderColor:
                          colors.primary,
                      },
                    ]}
                  >
                    {gender === option && (
                      <View
                        style={[
                          styles.radioSelected,
                          {
                            backgroundColor:
                              colors.primary,
                          },
                        ]}
                      />
                    )}
                  </View>

                  <Text
                    style={{
                      color: colors.text,
                    }}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          <Text
            style={[
              styles.label,
              {
                color: colors.text,
              },
            ]}
          >
            Mobile
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
            value={mobile}
            onChangeText={(text) =>
              setMobile(
                text.replace(/[^0-9]/g, '')
              )
            }
            keyboardType="number-pad"
            maxLength={10}
          />

          <Text
            style={[
              styles.label,
              {
                color: colors.text,
              },
            ]}
          >
            Address
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.addressInput,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={address}
            onChangeText={setAddress}
            multiline
            textAlignVertical="top"
          />

          <Text
            style={[
              styles.label,
              {
                color: colors.text,
              },
            ]}
          >
            City
          </Text>

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
              onValueChange={(value) =>
                setCity(value)
              }
              style={{
                color: colors.text,
              }}
              dropdownIconColor={
                colors.text
              }
            >
              <Picker.Item
                label="Select your city"
                value=""
              />
              <Picker.Item
                label="Hyderabad"
                value="Hyderabad"
              />
              <Picker.Item
                label="Warangal"
                value="Warangal"
              />
              <Picker.Item
                label="Karimnagar"
                value="Karimnagar"
              />
              <Picker.Item
                label="Nizamabad"
                value="Nizamabad"
              />
              <Picker.Item
                label="Khammam"
                value="Khammam"
              />
              <Picker.Item
                label="Siddipet"
                value="Siddipet"
              />
              <Picker.Item
                label="Secunderabad"
                value="Secunderabad"
              />
              <Picker.Item
                label="Vijayawada"
                value="Vijayawada"
              />
              <Picker.Item
                label="Visakhapatnam"
                value="Visakhapatnam"
              />
              <Picker.Item
                label="Bengaluru"
                value="Bengaluru"
              />
              <Picker.Item
                label="Chennai"
                value="Chennai"
              />
            </Picker>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>
              Save Changes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() =>
              setIsEditing(false)
            }
          >
            <Text
              style={[
                styles.cancelText,
                {
                  color: colors.primary,
                },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View
            style={[
              styles.infoCard,
              {
                backgroundColor: colors.card,
              },
            ]}
          >
            <ProfileRow
              label="Full Name"
              value={user.fullName}
              colors={colors}
            />

            <ProfileRow
              label="Email"
              value={user.email}
              colors={colors}
            />

            <ProfileRow
              label="Gender"
              value={user.gender}
              colors={colors}
            />

            <ProfileRow
              label="Mobile"
              value={user.mobile}
              colors={colors}
            />

            <ProfileRow
              label="Address"
              value={user.address}
              colors={colors}
            />

            <ProfileRow
              label="City"
              value={user.city}
              colors={colors}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.editButton,
              {
                backgroundColor:
                  colors.primary,
              },
            ]}
            onPress={handleEdit}
          >
            <Text style={styles.buttonText}>
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

function ProfileRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: {
    text: string;
    secondaryText: string;
    border: string;
  };
}) {
  return (
    <View
      style={[
        styles.row,
        {
          borderBottomColor:
            colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.rowLabel,
          {
            color: colors.secondaryText,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.rowValue,
          {
            color: colors.text,
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 35,
    textAlign: 'center',
  },

  avatar: {
    width: 85,
    height: 85,
    borderRadius: 43,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 25,
  },

  avatarText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  infoCard: {
    borderRadius: 12,
    paddingHorizontal: 15,
  },

  row: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },

  rowLabel: {
    fontSize: 13,
    marginBottom: 4,
  },

  rowValue: {
    fontSize: 16,
    fontWeight: '500',
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
  },

  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 12,
  },

  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
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
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  editButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  saveButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },

  cancelButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  logoutButton: {
    borderWidth: 1,
    borderColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },

  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
