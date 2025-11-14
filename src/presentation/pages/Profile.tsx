import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { profileStyles } from '../styles/ProfileStyles';
import { useAuthStore } from '../state/useAuthStore';
import { container } from '../../di/dependencies';
import { TYPES } from '../../di/types';
import { CandidateRepo } from '../../data/repository/candidate/CandidateRepo';
import { Gender } from '../../domain/models/Candidate';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { isAuthenticated, user, logout, updateUser } = useAuthStore();
  const scrollY = useRef(new Animated.Value(0)).current;
  const styles = profileStyles;

  // Profile form states
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<Gender | ''>('');
  const [link, setLink] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const candidateRepo = container.get<CandidateRepo>(TYPES.CandidateRepo);
      const response = await candidateRepo.getMyProfile();
      
      if (response && response.result) {
        const profile = response.result;
        setProfileId(profile.candidateId.toString());
        setFullName(profile.fullName || '');
        setTitle(profile.title || '');
        setPhone(profile.phone || '');
        setAddress(profile.address || '');
        
        // Handle DOB - only set if valid date exists
        if (profile.dob && profile.dob !== '') {
          setDob(new Date(profile.dob));
        } else {
          setDob(null);
        }
        
        // Handle Gender - set to empty string if not valid
        if (profile.gender && profile.gender !== '' && (profile.gender === 'MALE' || profile.gender === 'FEMALE' || profile.gender === 'OTHER')) {
          setGender(profile.gender as Gender);
        } else {
          setGender('');
        }
        
        setLink(profile.link || '');
        setImageUrl(profile.image || null);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      // Profile might not exist yet, that's okay - show empty form
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDob(selectedDate);
      if (Platform.OS === 'ios') {
        setShowDatePicker(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!fullName || !title || !phone || !address) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!dob) {
      Alert.alert('Error', 'Please select your date of birth');
      return;
    }

    if (!gender) {
      Alert.alert('Error', 'Please select your gender');
      return;
    }

    setUpdating(true);
    try {
      const candidateRepo = container.get<CandidateRepo>(TYPES.CandidateRepo);
      const payload = {
        fullName,
        title,
        phone,
        address,
        dob: dob ? formatDate(dob) : '',
        gender: gender || '',
        link: link || undefined,
      };

      if (profileId) {
        await candidateRepo.updateCandidate(payload);
        // Update user info in auth store
        updateUser({ fullname: fullName });
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        await candidateRepo.createCandidate(payload);
        // Update user info in auth store
        updateUser({ fullname: fullName });
        Alert.alert('Success', 'Profile created successfully!');
        await fetchProfile(); // Refresh to get the ID
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      Alert.alert('Error', error?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.replace('Auth', { screen: 'Welcome' });
          },
        },
      ]
    );
  };

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3DD5DC" />
      
      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>Personal Profile</Text>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* About Me Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          {isAuthenticated ? (
            <>
              <View style={styles.userInfoContainer}>
                <View style={styles.userAvatar}>
                  {imageUrl ? (
                    <Image 
                      source={{ uri: imageUrl }} 
                      style={styles.avatarImage}
                      defaultSource={require('../../../assets/img/login.png')}
                    />
                  ) : (
                    <Ionicons name="person" size={40} color="#FFFFFF" />
                  )}
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userFullName}>{user?.fullname || 'User'}</Text>
                  <Text style={styles.userEmail}>{user?.email || ''}</Text>
                  {title && <Text style={styles.userTitle}>{title}</Text>}
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.authButton, { backgroundColor: '#FF6B6B' }]}
                onPress={handleLogout}
              >
                <Text style={styles.authButtonText}>LOGOUT</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.welcomeText}>Welcome to CareerMate</Text>
              <TouchableOpacity 
                style={styles.authButton}
                onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
              >
                <Text style={styles.authButtonText}>SIGN UP / SIGN IN</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Profile Information Section */}
        {isAuthenticated && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Ionicons name="person-circle-outline" size={24} color="#3DD5DC" />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#3DD5DC" style={{ marginVertical: 20 }} />
            ) : (
              <>
                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name *</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="Enter your full name"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Title */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Job Title *</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="briefcase-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={title}
                      onChangeText={setTitle}
                      placeholder="e.g. Software Engineer"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Phone */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Phone Number *</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Enter phone number"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Address */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Address *</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={address}
                      onChangeText={setAddress}
                      placeholder="Enter your address"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Date of Birth */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Date of Birth *</Text>
                  <TouchableOpacity 
                    style={styles.inputWrapper}
                    onPress={() => {
                      setShowDatePicker(true);
                    }}
                  >
                    <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                    <Text style={[styles.dateText, !dob && { color: '#999' }]}>
                      {dob ? formatDate(dob) : 'Select your date of birth'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    value={dob || new Date(2000, 0, 1)}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                    maximumDate={new Date()}
                    minimumDate={new Date(1950, 0, 1)}
                  />
                )}

                {/* Gender */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Gender *</Text>
                  <View style={styles.genderContainer}>
                    <TouchableOpacity
                      style={[styles.genderButton, gender === 'MALE' && styles.genderButtonActive]}
                      onPress={() => setGender('MALE')}
                    >
                      <Ionicons 
                        name="male" 
                        size={20} 
                        color={gender === 'MALE' ? '#FFFFFF' : '#666'} 
                      />
                      <Text style={[styles.genderText, gender === 'MALE' && styles.genderTextActive]}>
                        Male
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.genderButton, gender === 'FEMALE' && styles.genderButtonActive]}
                      onPress={() => setGender('FEMALE')}
                    >
                      <Ionicons 
                        name="female" 
                        size={20} 
                        color={gender === 'FEMALE' ? '#FFFFFF' : '#666'} 
                      />
                      <Text style={[styles.genderText, gender === 'FEMALE' && styles.genderTextActive]}>
                        Female
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.genderButton, gender === 'OTHER' && styles.genderButtonActive]}
                      onPress={() => setGender('OTHER')}
                    >
                      <Ionicons 
                        name="transgender" 
                        size={20} 
                        color={gender === 'OTHER' ? '#FFFFFF' : '#666'} 
                      />
                      <Text style={[styles.genderText, gender === 'OTHER' && styles.genderTextActive]}>
                        Other
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {gender === '' && (
                    <Text style={styles.helperText}>Please select your gender</Text>
                  )}
                </View>

                {/* Portfolio Link */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Portfolio/LinkedIn Link</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="link-outline" size={20} color="#666" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={link}
                      onChangeText={setLink}
                      placeholder="https://..."
                      placeholderTextColor="#999"
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Update Button */}
                <TouchableOpacity 
                  style={[styles.updateButton, updating && { opacity: 0.6 }]}
                  onPress={handleUpdateProfile}
                  disabled={updating}
                >
                  {updating ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
                      <Text style={styles.updateButtonText}>UPDATE PROFILE</Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        {/* Applied Jobs Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Applied Jobs</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterTabs}>
            <TouchableOpacity style={[styles.filterTab, styles.activeTab]}>
              <Text style={styles.activeTabText}>Applied</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterTab}>
              <Text style={styles.tabText}>Saved</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterTab}>
              <Text style={styles.tabText}>Viewed</Text>
            </TouchableOpacity>
          </View>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <Ionicons name="file-tray-outline" size={80} color="#D0D0D0" />
            <Text style={styles.emptyText}>No Results Found</Text>
          </View>
        </View>

        {/* Job Suggestions Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Job Suggestions for You</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See More</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={60} color="#D0D0D0" />
            <Text style={styles.emptyText}>Sign in to see personalized suggestions</Text>
          </View>
        </View>

        {/* Extra padding for bottom tab bar */}
        <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
      </Animated.ScrollView>
    </View>
  );
}
