import React, { useRef, useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { profileStyles } from '../styles/ProfileStyles';
import { useAuthStore } from '../state/useAuthStore';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { isAuthenticated, user, logout } = useAuthStore();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [jobSearchEnabled, setJobSearchEnabled] = useState(false);
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false);
  const styles = profileStyles;

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
                  <Ionicons name="person" size={40} color="#FFFFFF" />
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userFullName}>{user?.fullname || 'User'}</Text>
                  <Text style={styles.userEmail}>{user?.email || ''}</Text>
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

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <View style={styles.settingItem}>
            <Ionicons name="search-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Job Search</Text>
            <Switch
              value={jobSearchEnabled}
              onValueChange={setJobSearchEnabled}
              trackColor={{ false: '#D0D0D0', true: '#3DD5DC' }}
              thumbColor={jobSearchEnabled ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>

          <View style={styles.settingItem}>
            <Ionicons name="paper-plane-outline" size={24} color="#666666" />
            <Text style={styles.settingText}>Auto Apply</Text>
            <Switch
              value={autoApplyEnabled}
              onValueChange={setAutoApplyEnabled}
              trackColor={{ false: '#D0D0D0', true: '#3DD5DC' }}
              thumbColor={autoApplyEnabled ? '#FFFFFF' : '#F4F3F4'}
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Activate within 30 days{'\n'}
              CareerMate will automatically introduce you to suitable Recruiters within 30 days.
            </Text>
          </View>
        </View>

        {/* CV Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CV / Cover Letter</Text>
          <Text style={styles.sectionDescription}>
            Do you want a job that suits you? Create a CV on CareerMate now so we can suggest the most suitable jobs
          </Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>UPLOAD/CREATE NEW CV</Text>
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Personality Test Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workplace Personality Test</Text>
          <Text style={styles.sectionDescription}>
            Take Workplace Personality Test to analyze your personal characteristics and abilities to determine whether you suitable for IT jobs and technology companies' working environment on the market.
          </Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>TAKE THE TEST</Text>
            <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

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
