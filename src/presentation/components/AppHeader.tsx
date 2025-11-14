import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import MenuDrawer from './MenuDrawer';
import { useAuthStore } from '../state/useAuthStore';

interface AppHeaderProps {
  scrollY?: Animated.Value;
  searchQuery?: string;
  onSearchChange?: (text: string) => void;
  showSearch?: boolean;
}

export default function AppHeader({ 
  scrollY, 
  searchQuery = '', 
  onSearchChange,
  showSearch = true,
}: AppHeaderProps) {
  const navigation = useNavigation<any>();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const headerOpacity = scrollY ? scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  }) : new Animated.Value(1);

  const stickySearchOpacity = scrollY ? scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  }) : new Animated.Value(0);

  const middleSearchOpacity = scrollY ? scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  }) : new Animated.Value(1);

  const middleSearchScale = scrollY ? scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  }) : new Animated.Value(1);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#3DD5DC" />

      <MenuDrawer 
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        isLoggedIn={isAuthenticated}
        userName={user?.fullname || 'Guest User'}
        onNavigateToLogin={() => navigation.navigate('Auth', { screen: 'Login' })}
      />

      {/* Sticky Search Bar */}
      {showSearch && (
        <Animated.View style={[styles.stickySearchBar, { opacity: stickySearchOpacity }]}>
          <View style={styles.stickySearchContent}>
            <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
              <Ionicons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.stickySearchInputContainer}>
              <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.stickySearchInput}
                placeholder="Enter keyword to search"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={onSearchChange}
              />
            </View>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notification')}
            >
              <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Main Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>CareerMate</Text>
        </View>

        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notification')}
        >
          <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </Animated.View>

      {/* Search Bar - nằm giữa khi chưa scroll, fade out khi scroll */}
      {showSearch && (
        <Animated.View style={[
          styles.searchSection, 
          { 
            opacity: middleSearchOpacity,
            transform: [{ scaleY: middleSearchScale }],
            height: middleSearchScale.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 55],
            })
          }
        ]}>
          <View style={styles.searchWrapper}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Enter keyword to search"
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={onSearchChange}
              />
            </View>
          </View>
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  stickySearchBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#3DD5DC',
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  stickySearchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stickySearchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
  },
  stickySearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#333333',
    paddingVertical: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 15,
    paddingBottom: 20,
    backgroundColor: '#3DD5DC',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0000',
    borderWidth: 1,
    borderColor: '#3DD5DC',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    maxWidth: 140,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userNameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    maxWidth: 90,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    marginBottom: -5,
  },
  searchWrapper: {
    marginTop: -20,
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    paddingVertical: 0,
  },
});
